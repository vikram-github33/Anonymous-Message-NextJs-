interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <title>Verification Code</title>
      </head>
      <body>
        <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden' }}>
          Here&apos;s your verification code: {otp}
        </div>
        <main>
          <h2>Hello {username},</h2>
          <p>
            Thank you for registering. Please use the following verification
            code to complete your registration:
          </p>
          <p>{otp}</p>
          <p>
            If you did not request this code, please ignore this email.
          </p>
        {/* <Row>
          <Button
            href={`http://localhost:3000/verify/${username}`}
            style={{ color: '#61dafb' }}
          >
            Verify here
          </Button>
        </Row> */}
        </main>
      </body>
    </html>
  );
}
