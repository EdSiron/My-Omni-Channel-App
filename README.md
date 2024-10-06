# My-Omni-Channel-App 🚀
This project is an Omni-Channel Communication App, designed to streamline multiple communication channels into one platform. The app allows for seamless chat, email, SMS, and voice call interactions, both inbound and outbound. This was developed as part of a demo project for an assessment.

## Features ✨

The Omni-Channel Communication App comes with four main functionalities:

1. **💬 Real-Time Chat (With Attachments)**:  
   - Send and receive real-time messages with attachments (images, documents, etc.).
   - Built using **Firebase Realtime Database** for live synchronization and instant message updates.

2. **📧 Email (With Attachments)**:  
   - Send and receive emails with attachments.
   - Uses **Nodemailer** for sending emails and **IMAP/IMAPFlow** for fetching emails from Google accounts.

3. **📱 SMS Messaging**:  
   - Send and receive SMS messages.
   - Powered by **Twilio**, ensuring reliable SMS communication.

4. **📞 Voice Calls (Inbound & Outbound)**:  
   - Make and receive voice calls directly from the app.
   - Voice call functionality is supported by **Twilio**.

## 🔒 Authentication

- **Firebase Authentication** is used for secure user login and signup, ensuring a seamless onboarding experience.

## Tech Stack 🛠️

- **Next.js**: Framework for building a fast, scalable frontend with server-side rendering.
- **Firebase Realtime Database**: For real-time chat data management.
- **Firebase Authentication**: To handle user authentication securely.
- **Nodemailer**: For sending emails with attachments.
- **IMAP & IMAPFlow**: For fetching incoming emails.
- **Twilio**: For managing SMS messaging and voice calls.

## Getting Started 🚀

To get started with the app locally, follow the instructions below to run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Once running, open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

You can start editing by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## 📚 Learn More

To dive deeper into Next.js, check out these resources:

- [Next.js Documentation](https://nextjs.org/docs) - Explore Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - An interactive tutorial to get you started.

You can also visit the [Next.js GitHub repository](https://github.com/vercel/next.js) to contribute and explore the project.

## 🌐 Deployment

The easiest way to deploy this Next.js app is with [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), the platform that created Next.js.

Check out the official [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

This project showcases the power of modern communication platforms by integrating multiple channels into a single, user-friendly application.
