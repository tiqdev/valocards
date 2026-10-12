export const languages = [
  { name: "English", value: "en-US" },
  { name: "Türkçe", value: "tr-TR" },
  { name: "Русский", value: "ru-RU" },
] as const;

export type LanguageCode = (typeof languages)[number]["value"];

export const defaultLanguage: LanguageCode = "tr-TR";

export const LANGUAGE_COOKIE = "valocards-lang";

export const isLanguageCode = (value: string): value is LanguageCode =>
  languages.some((lang) => lang.value === value);

/** "tr-TR,tr;q=0.9,en;q=0.8" gibi bir Accept-Language başlığından dil seçer. */
export const matchLanguage = (acceptLanguage: string | null) => {
  const preferred = (acceptLanguage ?? "")
    .split(",")
    .map((part) => part.split(";")[0]?.trim().slice(0, 2).toLowerCase());

  for (const code of preferred) {
    const match = languages.find((lang) => lang.value.startsWith(`${code}-`));
    if (match) return match.value;
  }

  return undefined;
};

const en = {
  tab_player: "Player",
  tab_card: "Card",
  tab_agent: "Agent",
  tab_rank: "Rank",
  tab_title: "Title",
  username: "Riot ID",
  username_placeholder: "Your cool username",
  tag: "Tag",
  level: "Account level",
  search_cards: "Search cards…",
  search_titles: "Search titles…",
  no_results: "No results",
  vertical_label: "Vertical",
  horizontal_label: "Horizontal",
  fade_label: "Fade effect",
  download_label: "Download PNG",
  downloading: "Preparing image…",
  downloaded: "Card downloaded",
  download_error: "An error occurred while downloading the image",
  copy_link: "Copy link",
  link_copied: "Link copied",
  randomize: "Randomize",
  language_label: "Language",
  theme_light: "Light",
  theme_dark: "Dark",
  theme_system: "System",
  toggle_theme: "Toggle theme",
  fetch_error: "Game data could not be loaded",
  retry: "Retry",
  preview: "Preview",
  edit_label: "Edit",
  close_label: "Close",
  editor_title: "Edit card",
  filter_all: "All",
  source_battlepass: "Battle Pass",
  source_agent: "Agent",
  source_event: "Event",
  rare_label: "Rare",
  rare_hint: "Only visible in the collection to players who own it",
  game_version: "Game data",
  disclaimer:
    "ValoCards was created under Riot Games' \"Legal Jibber Jabber\" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.",
};

export type Translations = typeof en;

export const translations: Record<LanguageCode, Translations> = {
  "en-US": en,
  "tr-TR": {
    tab_player: "Oyuncu",
    tab_card: "Kart",
    tab_agent: "Ajan",
    tab_rank: "Rank",
    tab_title: "Ünvan",
    username: "Riot ID",
    username_placeholder: "Havalı kullanıcı adınız",
    tag: "Etiket",
    level: "Hesap seviyesi",
    search_cards: "Kart ara…",
    search_titles: "Ünvan ara…",
    no_results: "Sonuç bulunamadı",
    vertical_label: "Dikey",
    horizontal_label: "Yatay",
    fade_label: "Solma efekti",
    download_label: "PNG indir",
    downloading: "Görsel hazırlanıyor…",
    downloaded: "Kart indirildi",
    download_error: "Görsel indirilirken bir hata oluştu",
    copy_link: "Linki kopyala",
    link_copied: "Link kopyalandı",
    randomize: "Rastgele",
    language_label: "Dil",
    theme_light: "Açık",
    theme_dark: "Koyu",
    theme_system: "Sistem",
    toggle_theme: "Temayı değiştir",
    fetch_error: "Oyun verileri yüklenemedi",
    retry: "Tekrar dene",
    preview: "Önizleme",
    edit_label: "Düzenle",
    close_label: "Kapat",
    editor_title: "Kartı düzenle",
    filter_all: "Tümü",
    source_battlepass: "Battle Pass",
    source_agent: "Ajan",
    source_event: "Etkinlik",
    rare_label: "Nadir",
    rare_hint: "Koleksiyonda sadece sahip olan oyunculara görünür",
    game_version: "Oyun verisi",
    disclaimer:
      "ValoCards, Riot Games'in \"Legal Jibber Jabber\" politikası kapsamında Riot Games'e ait varlıklar kullanılarak oluşturulmuştur. Riot Games bu projeyi onaylamamakta veya desteklememektedir.",
  },
  "ru-RU": {
    tab_player: "Игрок",
    tab_card: "Карточка",
    tab_agent: "Агент",
    tab_rank: "Ранг",
    tab_title: "Титул",
    username: "Riot ID",
    username_placeholder: "Твоё крутое имя пользователя",
    tag: "Тег",
    level: "Уровень аккаунта",
    search_cards: "Поиск карточек…",
    search_titles: "Поиск титулов…",
    no_results: "Ничего не найдено",
    vertical_label: "Вертикальная",
    horizontal_label: "Горизонтальная",
    fade_label: "Эффект затухания",
    download_label: "Скачать PNG",
    downloading: "Готовим изображение…",
    downloaded: "Карточка скачана",
    download_error: "Не удалось скачать изображение",
    copy_link: "Скопировать ссылку",
    link_copied: "Ссылка скопирована",
    randomize: "Случайно",
    language_label: "Язык",
    theme_light: "Светлая",
    theme_dark: "Тёмная",
    theme_system: "Системная",
    toggle_theme: "Сменить тему",
    fetch_error: "Не удалось загрузить игровые данные",
    retry: "Повторить",
    preview: "Предпросмотр",
    edit_label: "Редактировать",
    close_label: "Закрыть",
    editor_title: "Редактирование карточки",
    filter_all: "Все",
    source_battlepass: "Боевой пропуск",
    source_agent: "Агент",
    source_event: "Событие",
    rare_label: "Редкое",
    rare_hint: "Видно в коллекции только владельцам",
    game_version: "Данные игры",
    disclaimer:
      "ValoCards создан в соответствии с политикой Riot Games «Legal Jibber Jabber» с использованием материалов, принадлежащих Riot Games. Riot Games не одобряет и не спонсирует этот проект.",
  },
};
