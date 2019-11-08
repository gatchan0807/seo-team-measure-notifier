interface Measure {
  id: string;
  director: string;
  about: string;
  status: string;
  sheetId: string;
}

interface Attachment {
  text?: string;
  author_name?: string;
  author_icon?: string;
  color?: string;
  title?: string;
  title_link?: string;
  pretext?: string;
  fields?: Array<any>;
  image_url?: string;
  footer?: string;
}

interface NotifyMessage {
  username: string;
  icon_emoji: string;
  attachments: Array<Attachment>;
}

function entrypoint() {
  let measureList: Array<Measure> = _getMeasureList();
  _notifyWithSlack(_filterMeasureList(measureList));
}

function _getMeasureList(): Array<Measure> {
  const spreadSheetId = '1vTkCa84GVVv377CaUJrqolMxsgNgUzd8UvbYLeHEnWg'; // SEOチーム管理シート
  const spreadsheet = SpreadsheetApp.openById(spreadSheetId);

  const sheet = spreadsheet.getSheetByName('施策案リスト');

  const lastRowNumber = sheet.getLastRow() - 1;
  const rawMeasures = sheet.getRange(2, 1, lastRowNumber, 13).getValues();

  const measures = _convertMeasures(rawMeasures);

  return measures;
}

function _convertMeasures(raw: Array<any>): Array<Measure> {
  let measures = raw.map(rawMeasure => {
    let m: Measure = {
      id: rawMeasure[1],
      director: rawMeasure[11],
      about: rawMeasure[2],
      status: rawMeasure[6],
      sheetId: rawMeasure[12]
    };
    return m;
  });
  return measures;
}

function _notifyWithSlack(measureList: Array<Measure>) {
  const formattedText = _formatText(measureList);

  const SLACK_URL = '[https://hooks.slack.com/services/]'; // 本番
  // const SLACK_URL ='[https://hooks.slack.com/services/]'; // テスト
  let options = {
    method: 'post',
    headers: { 'Content-type': 'application/json' },
    payload: JSON.stringify(formattedText)
  };

  UrlFetchApp.fetch(SLACK_URL, options);
}

function _filterMeasureList(measureList: Array<Measure>): Array<Measure> {
  let filteredMeasureList = measureList.map(measure => {
    if (
      typeof measure !== 'undefined' &&
      measure.status.indexOf('検討会判断待ち') !== -1
    ) {
      return measure;
    }
  });

  // null削除
  filteredMeasureList = filteredMeasureList.filter(v => v);

  return filteredMeasureList;
}

function _formatText(measureList: Array<Measure>): NotifyMessage {
  let notifyMessage: NotifyMessage = {
    username: 'SEOチーム施策リスト通知くん',
    icon_emoji: 'rabbit',
    attachments: [
      {
        color: '#ff7f17',
        title: `SEO定例 【${Utilities.formatDate(
          new Date(),
          'JST',
          'yyyy/MM/dd'
        )}】 検討委員会判断待ちIssueリスト`
      }
    ]
  };

  let textList: Array<string> = measureList.map(measure => {
    return `
【Jira ID ${measure.id}】
施策概要: ${measure.about}
起案者: ${measure.director}
ステータス: ${measure.status}
検討会施策シート番号: ${measure.sheetId}
`;
  });

  let text: string = textList.join('');

  text = `\`\`\`${text}\`\`\``;
  notifyMessage.attachments[0]['text'] = text;

  return notifyMessage;
}
