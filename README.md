# 🎨 artechbid

Welcome to the artechbid! This project is a web application where users can create, view, and bid on artwork. It supports bidding and notifications to keep you updated with the latest bids. 🖌️

## 🌟 Features

- 🖼️ **Artwork Creation:** Users can create and upload their own artwork.
- 💸 **Real-Time Bidding:** Bid on artwork created by others.
- 📢 **Notifications:** Receive notifications if someone outbids you.
- ⏳ **Auction Timer:** Countdown timer for live auctions.
- 📜 **User Profiles:** Track your bids and created artworks.

## 🛠️ Tech Stack

- **Frontend:** NextJS, ReactJS, Tailwind CSS, ShadCN
- **Backend:** Firebase (Firestore, Firebase Storage, Cloud Functions)
- **Authentication:** NextAuth
- **Notification System:** Firestore triggers and collections

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v20+)
- Yarn or npm or pnpm

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/J3E1/artechbid.git
   cd art-auction-platform
   ```

2. **Install Dependencies:**

   ```bash
   yarn install
   ```

   or

   ```bash
   npm install
   ```
   or

   ```bash
   pnpm install
   ```

3. **Set Up Firebase:**

   - Create a new project in the [Firebase Console](https://console.firebase.google.com/).
   - Add a new web app to your Firebase project.
   - Copy the Firebase config object and paste it into a new file named `firebaseConfig.js` in the `src` directory:

     ```javascript
     // src/firebaseConfig.js
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.appspot.com",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
       measurementId: "YOUR_MEASUREMENT_ID"
     };

     export default firebaseConfig;
     ```

4. **Configure Firestore Rules:**

   Go to the Firebase Console and navigate to Firestore Database > Rules. Set your rules to:

   ```plaintext
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if true;
         match /notifications/{notificationId} {
           allow read, write: true;
         }
       }
       match /artworks/{artworkId} {
         allow read, write: true;
         match /bids/{bidId} {
           allow read, write: true;
         }
       }
     }
   }
   ```

5. **Start the Development Server:**

   ```bash
   yarn dev
   ```

   or

   ```bash
   npm run dev
   ```
   or

   ```bash
   npm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.

## 📚 Usage

- **Create an Account:** Sign up and create your user profile.
- **Add Artwork:** Navigate to the 'create' section to upload and create your artwork.
- **Bid on Artwork:** Browse available artwork and place bids in real-time.
- **Notifications:** Check your notifications to see if you've been outbid.

## 💡 Future Improvements

- Add user settings and profile customization.
- Add OAuth.
- Implement social sharing features for artwork.
- Enhance the notification system with email alerts.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Thanks to the amazing Firebase community for the awesome tools and support.
- Inspired by [dribble design](https://dribbble.com/shots/19414536-Auktion-NFT-Auction-Site).

