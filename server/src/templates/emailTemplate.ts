// src/templates/emailTemplate.ts

// если вы пушите в .env:
// BACKEND_URL=http://localhost:4001
// CLIENT_URL=http://localhost:5173

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4001';
const CLIENT_URL  = process.env.CLIENT_URL  ?? 'http://localhost:5173';
const ASSETS_URL  = `${BACKEND_URL}/static/email-icons`;

export function buildApprovalHtml(
  firstName: string,
  lastName: string,
  email: string,
  message: any,
  BACKEND_URL: string
): string {
  const fullName = `${firstName} ${lastName}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Account Approved</title>
  <style>
    body { margin:0; padding:0; background:#e8eff2; font-family:Arial,sans-serif; color:#333; }
    .wrapper { max-width:600px; margin:30px auto; border-radius:12px; overflow:hidden; background:#e8eff2; }
    .header { text-align:center; padding:20px; }
    .header h1 { margin:16px 0 4px; font-size:24px; }
    .header p { margin:0; font-size:16px; }
    .card { background:#fff; margin:20px; padding:30px; border-radius:8px; text-align:center; }
    .card img { width:80px; height:auto; }
    .card p { font-size:14px; line-height:1.6; color:#555; margin:12px 0; }
    .btn { display:inline-block; margin-top:20px; padding:12px 24px; background:#000000; color:#e9ff61; text-decoration:none; border-radius:24px; font-weight:bold; }
    .apps { background:#fff; margin:20px; padding:20px; border-radius:8px; text-align:center; }
    .apps h2 { margin-bottom:12px; font-size:18px; }
    .apps p { font-size:14px; color:#666; margin-bottom:16px; }
    .apps a img { margin:0 8px; vertical-align:middle; height:40px; }
    .social { text-align:center; padding:20px; }
    .social a img { width:48px; height:48px; margin:0 6px; display:inline-block; }
    .footer { text-align:center; padding:10px; font-size:12px; color:#999; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <img src="cid:logo@cid" alt="Company Logo" />
      <h1>Hi ${fullName},</h1>
      <p>Your <strong>productName</strong> account has been <strong>approved</strong>!</p>
    </div>

    <div class="card">
      <img src="cid:check@cid" alt="Approved"/>
      <p>Your <strong>Reserve</strong> has been approved and we will contact with you within few days.</p>
      <p>You also can now access <strong>EV VOLTEDGE</strong> online or on any device by going to <a href="${CLIENT_URL}">${CLIENT_URL}</a></p>
      <a href="${CLIENT_URL}" class="btn">Get started</a>
    </div>

    <div class="apps">
      <h2>Get the EV VOLTEDGE app!</h2>
      <p>Get the most of EV VOLTEDGE by installing our mobile app.</p>
      <a href="https://play.google.com/store">
        <img src="cid:gp@cid" alt="Google Play"/>
      </a>
      <!--
       <a href="https://apps.apple.com/app">
          <img src="cid:as@cid" alt="App Store"/>
        </a>
      -->
    </div>

    <div class="social">
      <a href="https://facebook.com/YourPage"><img src="cid:fb@cid" alt="Facebook"/></a>
      <a href="https://linkedin.com/company/YourPage"><img src="cid:li@cid" alt="LinkedIn"/></a>
      <a href="https://instagram.com/YourPage"><img src="cid:ig@cid" alt="Instagram"/></a>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()}<br/>EV VOLTEDGE</p>
    </div>
  </div>
</body>
</html>
`;
}
