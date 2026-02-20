import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * وظيفة تهيئة التطبيق (Initialization)
 * تم تصميمها لضمان استقرار التشغيل حتى في حال تأخر تحميل الـ DOM 
 * أو غياب عنصر الجذر "root" من ملف HTML.
 */
const mountApp = () => {
  let rootElement = document.getElementById('root');

  // بدلاً من إلقاء خطأ (throw Error) الذي يؤدي لتوقف التطبيق بالكامل،
  // نقوم بإنشاء عنصر الجذر برمجياً لضمان استمرارية العمل.
  if (!rootElement) {
    console.warn("عنصر الجذر 'root' غير موجود في المستند، يتم إنشاؤه حالياً...");
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  }

  // استخدام ReactDOM.createRoot لتهيئة تطبيق React 18+
  const root = ReactDOM.createRoot(rootElement as HTMLElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// تشغيل التطبيق بمجرد جهوزية المستند
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
