# Privacy Notice

This project is intended for local development and demonstration. Review and
adapt this notice before deploying a public service.

## Data Processed

- Food photos selected by the user are converted to base64 in the browser and
  sent to the local backend endpoint `/api/analyze-food`.
- In real AI mode, the backend forwards the image payload to the configured
  DashScope/Qwen-compatible API provider.
- Blood sugar records are stored in the user's browser `localStorage` by
  default.

## Data Not Intentionally Stored

- The backend does not persist uploaded images.
- The backend should not log uploaded image payloads or blood sugar records.
- API keys must be provided through environment variables and must not be
  committed to the repository.

## Deployment Checklist

- Publish a service-specific privacy policy before collecting real user data.
- Confirm the AI provider's data processing terms for your region and use case.
- Use HTTPS and restrict CORS origins in production.
- Avoid sending personally identifiable information in uploaded images.
- Provide a way for users to delete locally stored records.

## Health Information Notice

GI values, nutrition estimates, and food recognition output are informational
only. They are not medical diagnosis, treatment, or prescription advice.
