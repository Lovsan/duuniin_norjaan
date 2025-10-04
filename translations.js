// Simplified multi-language support - Language codes for all required languages
const LANGUAGES = {
    en: '🇬🇧 English',
    no: '🇳🇴 Norsk',
    sv: '🇸🇪 Svenska',
    da: '🇩🇰 Dansk',
    fi: '🇫🇮 Suomi',
    et: '🇪🇪 Eesti',
    lv: '🇱🇻 Latviešu',
    lt: '🇱🇹 Lietuvių',
    pl: '🇵🇱 Polski',
    it: '🇮🇹 Italiano',
    ru: '🇷🇺 Русский',
    uk: '🇺🇦 Українська',
    es: '🇪🇸 Español',
    fr: '🇫🇷 Français'
};

// Get current language from localStorage or default to English
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'en';
}

// Set language
function setLanguage(lang) {
    localStorage.setItem('language', lang);
    location.reload();
}

// Get translated text (simplified - in production would load from translation files)
function t(key, lang = getCurrentLanguage()) {
    // This is a simplified version - in a full implementation, 
    // translations would be loaded from separate JSON files per language
    return key;
}
