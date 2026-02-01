require('dotenv').config();
const querystring = require('querystring');
const { CozeAPI } = require('@coze/api');

const key = requireEnv('SCT_KEY');
const token = requireEnv('COZE_TOKEN');
const workflowId = requireEnv('COZE_WORKFLOW_ID');
const workflowInput = process.env.COZE_INPUT ?? 'AI科技\n';
const baseURL = process.env.COZE_BASE_URL ?? 'https://api.coze.cn';

(async () => {
  const apiClient = new CozeAPI({
    token,
    baseURL
  });

  const workflowText = await runWorkflowText(apiClient, workflowId, {
    input: workflowInput
  });
  const formattedText = normalizeText(workflowText);
  const ret = await sc_send(formattedText, '', key);
  console.log(ret);
})();

async function sc_send(text, desp = '', key = '[SENDKEY]') {
  const postData = querystring.stringify({ text, desp });
  // 根据 sendkey 是否以 'sctp' 开头，选择不同的 API URL
  const url = String(key).match(/^sctp(\d+)t/i)
    ? `https://${key.match(/^sctp(\d+)t/i)[1]}.push.ft07.com/send/${key}.send`
    : `https://sctapi.ftqq.com/${key}.send`;

  console.log('url', url);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    },
    body: postData
  });

  const data = await response.text();
  return data;
}

function normalizeText(text) {
  if (!text) {
    return '';
  }
  return String(text).replace(/\\n/g, '\n').trim();
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function runWorkflowText(apiClient, workflowId, parameters) {
  const stream = await apiClient.workflows.runs.stream({
    workflow_id: workflowId,
    parameters
  });

  const chunks = [];
  for await (const event of stream) {
    const content =
      event?.data?.content ??
      event?.data?.message?.content ??
      event?.data?.output ??
      event?.content;
    if (content) {
      chunks.push(content);
    }
  }

  return chunks.join('');
}
