importScripts(
    "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"
);
importScripts(
    "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyC--qrq6LLVCOqQEd1gCRNryElWmQ6FYVM",
    authDomain: "fir-app-2e08c.firebaseapp.com",
    projectId: "fir-app-2e08c",
    storageBucket: "fir-app-2e08c.firebasestorage.app",
    messagingSenderId: "482442963385",
    appId: "1:482442963385:web:81cb4687a15bdcac4f2e68",
    measurementId: "G-6ZKR2FCJV6",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
    console.log("Received background message: ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
