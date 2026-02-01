# fangtang-server

Run a Coze workflow and push the formatted content via Server酱.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `SCT_KEY` | ✅ | Server酱 send key. |
| `COZE_TOKEN` | ✅ | Coze API token. |
| `COZE_WORKFLOW_ID` | ✅ | Coze workflow ID. |
| `COZE_INPUT` | ❌ | Workflow input text (default: `AI科技`). |
| `COZE_BASE_URL` | ❌ | Coze base URL (default: `https://api.coze.cn`). |

## GitHub Actions

The workflow is defined in `.github/workflows/run-coze-workflow.yml` and runs on a daily
schedule plus manual dispatch. Add the required secrets in your repository settings:

- `SCT_KEY`
- `COZE_TOKEN`
- `COZE_WORKFLOW_ID`
- Optional: `COZE_INPUT`, `COZE_BASE_URL`
