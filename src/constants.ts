
import { Temple, TempleCulture } from './types';

export const TEMPLES: Temple[] = [
  {
    id: 'vanthuytu',
    name: 'Храм Ван Туй Ту',
    russianName: 'Van Thuy Tu Temple',
    culture: TempleCulture.VIETNAMESE,
    duration: '40 мин',
    hasLunchBreak: true,
    openTime: '07:30',
    closeTime: '17:00',
    description: 'Главная святыня рыбаков со скелетом гигантского кита.',
    history: 'Построен в 1762 году. Здесь вы увидите скелет кита длиной 22 метра. Вьетнамцы верят, что он защищает их в море.',
    location: { address: 'W4F2+53 Phan Thiết, Бин Туан, Вьетнам' },
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=800',
    highlights: ['Скелет кита', 'Алтари', 'Лодки'],
    audioScript: 'Ван Туй Ту — это сердце Фантьета. Но помните, в 17:00 двери закрываются.'
  },
  {
    id: 'chuaong',
    name: 'Храм Гуань Юя (Chua Ong)',
    russianName: 'Chinese Assembly Hall',
    culture: TempleCulture.CHINESE,
    duration: '30 мин',
    hasLunchBreak: true,
    openTime: '07:00',
    closeTime: '17:00',
    description: 'Старейший китайский храм с великолепной резьбой.',
    history: 'Построен общиной Хоккиен. Посвящен генералу Гуань Юю — символу чести.',
    location: { address: 'W4G3+6G Phan Thiết, Бин Туан, Вьетнам' },
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800',
    highlights: ['Статуи', 'Керамика', 'Благовония'],
    audioScript: 'Здесь всегда пахнет сандалом. Успейте до заката.'
  },
  {
    id: 'watertower',
    name: 'Водонапорная башня',
    russianName: 'Water Tower',
    culture: TempleCulture.HISTORY,
    duration: '20 мин',
    hasLunchBreak: false,
    openTime: '00:00',
    closeTime: '23:59',
    isNightActive: true,
    description: 'Символ города, который оживает в вечерней подсветке.',
    history: 'Построена в 1934 году. Вечером она подсвечивается огнями, отражаясь в реке Ка Ти.',
    location: { address: 'W4H2+VP Phan Thiết, Бин Туан, Вьетнам' },
    imageUrl: 'https://images.unsplash.com/photo-1596402184320-417d7178b2cd?auto=format&fit=crop&q=80&w=800',
    highlights: ['Подсветка', 'Вид на реку'],
    audioScript: 'Башня прекрасна именно вечером. Когда храмы закрыты, она только начинает сиять.'
  },
  {
    id: 'posahinu',
    name: 'Башни Пошану',
    russianName: 'Po Sah Inu Towers',
    culture: TempleCulture.CHAM,
    duration: '60 мин',
    hasLunchBreak: false,
    openTime: '07:30',
    closeTime: '18:00',
    isNightActive: true,
    description: 'Древние индуистские башни чамов на холме.',
    history: 'Построенные в IX веке, эти башни лучше всего смотрятся в лучах заходящего солнца.',
    location: { address: 'W5H5+9P Phan Thiết, Бин Туан, Вьетнам' },
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516905?auto=format&fit=crop&q=80&w=800',
    highlights: ['Кирпич IX века', 'Вид на море'],
    audioScript: 'Поднимитесь сюда к 16:30. Теплый свет сделает кирпич башен огненно-рыжим.'
  },
  {
    id: 'fishingvillage',
    name: 'Рыбацкая деревня',
    russianName: 'Mui Ne Fishing Village',
    culture: TempleCulture.VIETNAMESE,
    duration: '60 мин',
    hasLunchBreak: false,
    openTime: '00:00',
    closeTime: '23:59',
    isNightActive: true,
    description: 'Магия заката и ночные огни рыбацких лодок.',
    history: 'Днем это рынок, а вечером — бесконечное море огней. Сотни лодок зажигают лампы для ночного лова.',
    location: { address: 'X7F2+R2 Phan Thiết, Бин Туан, Вьетнам' },
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
    highlights: ['Закат 17:15', 'Море огней'],
    audioScript: 'Это финал. В 17:15 небо станет розовым, а лодки превратятся в светлячков.'
  }
];

export const APP_CONFIG = {
  TITLE: 'Phan Thiết: Путь Хранителя',
  SUBTITLE: 'Маршрут, оживающий во времени',
  TRIPSTER_URL: 'https://experience.tripster.ru/experience/98200/',
};
