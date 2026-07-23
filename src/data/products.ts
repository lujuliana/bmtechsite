export interface ProductMetadata {
  title: string;
  description: string;
}

export type ProductLocale = 'en' | 'ja';

export interface Product {
  slug: string;
  name: string;
  featured?: boolean;
  fullName: { en: string; ja: string };
  fullNameJa?: string;
  category: string;
  searchKeywords?: Partial<Record<ProductLocale, readonly string[]>>;
  image: { src: string };
  features: { en: string[]; ja: string[] };
  applications: { en: string[]; ja: string[] };
  metadata: ProductMetadata;
}

export const products: Product[] = [
  {
    slug: 'bbmu',
    name: 'BBMU',
    featured: true,
    fullName: {
      en: 'Battery Bank Management Unit',
      ja: 'バッテリーバンク管理ユニット',
    },
    category: 'BMS',
    searchKeywords: {
      en: ['battery bank', 'bank management', 'battery management unit'],
      ja: ['バッテリーバンク', '蓄電池バンク', 'バンク管理', 'バッテリー管理'],
    },
    image: { src: 'bbmu.jpg' },
    features: {
      en: [
        'Quad-core Cortex-A55 2.0 GHz CPU',
        '2GB LPDDR4 and 128GB TF-card/SSD',
        'Multiple DO and DI interfaces for other equipment in battery container',
        'Multiple CAN and RS485 interfaces for other equipment in battery container',
        'Supports dual-channel communication with EMS',
      ],
      ja: [
        'クアッドコア Cortex-A55 2.0 GHz CPU 搭載',
        '2GB LPDDR4 および 128GB TFカード/SSD',
        'コンテナ内他設備接続用の多チャンネルDO/DIインターフェース',
        'コンテナ内他設備接続用の多チャンネルCAN/RS485インターフェース',
        'EMSとの2系統（デュアルチャンネル）通信に対応',
      ],
    },
    applications: {
      en: ['Grid Energy Storage', 'Renewable Energy Systems', 'Uninterruptible Power Supply (UPS) Systems'],
      ja: ['系統用蓄電池システム', '再生可能エネルギーシステム', '無停電電源装置 (UPS) システム'],
    },
    metadata: {
      title: 'BBMU Battery Bank Management Unit | BMTech',
      description: 'Optimize your power infrastructure with the BBMU Battery Bank Management Unit. Ideal for grid, renewable energy systems, and uninterruptible UPS.',
    },
  },
  {
    slug: 'bmmu',
    name: 'BMMU',
    featured: true,
    fullName: {
      en: 'Battery Module Management Unit',
      ja: 'バッテリーモジュール管理ユニット',
    },
    category: 'BMS',
    searchKeywords: {
      en: ['battery module', 'module management', 'battery management unit'],
      ja: ['バッテリーモジュール', '蓄電池モジュール', 'モジュール管理', 'バッテリー管理'],
    },
    image: { src: 'bmmu.jpg' },
    features: {
      en: [
        'Compliant with UL1973/UL60730 standards',
        '8-64S configuration, compatible with multiple battery module architectures',
        'Top-tier AFE solution with ±3mV single cell voltage measurement accuracy',
        'Supports temperature measurement of all individual cells and power connectors',
        'Iso-SPI communication between BMMUs',
      ],
      ja: [
        'UL1973/UL60730規格に準拠',
        '8〜64S構成に対応、複数のバッテリーモジュールアーキテクチャと互換性あり',
        'トップクラスのAFEソリューションを採用、単一セルの電圧測定精度±3mVを達成',
        'すべての単一セルおよび電源コネクタの温度測定に対応',
        'BMMU間のIso-SPI通信に対応',
      ],
    },
    applications: {
      en: ['Grid Energy Storage', 'Renewable Energy Systems', 'Residential Energy Storage', 'Uninterruptible Power Supply (UPS) Systems'],
      ja: ['系統用蓄電池システム', '再生可能エネルギーシステム', '住宅用蓄電池システム', '無停電電源装置 (UPS) システム'],
    },
    metadata: {
      title: 'BMMU Battery Module Management Unit | BMTech',
      description: 'Optimize your power infrastructure with the BMMU Battery Module Management Unit. Ideal for grid, renewable, residential energy storage, and UPS.',
    },
  },
  {
    slug: 'brmu',
    name: 'BRMU',
    featured: true,
    fullName: {
      en: 'Battery Rack Management Unit',
      ja: 'バッテリーラック管理ユニット',
    },
    category: 'BMS',
    searchKeywords: {
      en: ['battery rack', 'rack management', 'battery management unit'],
      ja: ['バッテリーラック', '蓄電池ラック', 'ラック管理', 'バッテリー管理'],
    },
    image: { src: 'brmu.jpg' },
    features: {
      en: [
        'Compliant with UL1973/UL60730 standards',
        'Supports CAN communication and LAN communication between BRMU and BBMU',
        'Supports ring connection of Iso-SPI',
        'Supports shunt sensors and hall sensors',
        'Multiple DO and DI interfaces meet project design requirements',
        'Supports 4,000m altitude applications',
      ],
      ja: [
        'UL1973/UL60730規格に準拠',
        'BRMUとBBMU間のCAN通信およびLAN通信に対応',
        'Iso-SPIのリングトポロジー接続に対応',
        'シャントセンサおよびホールセンサに対応',
        'プロジェクトの設計要件を満たす多チャンネルDO/DIインターフェース',
        '標高4,000mの高地アプリケーションに対応',
      ],
    },
    applications: {
      en: ['Grid Energy Storage', 'Renewable Energy Systems', 'Residential Energy Storage', 'Uninterruptible Power Supply (UPS) Systems'],
      ja: ['系統用蓄電池システム', '再生可能エネルギーシステム', '住宅用蓄電池システム', '無停電電源装置 (UPS) システム'],
    },
    metadata: {
      title: 'BRMU Battery Rack Management Unit | BMTech',
      description: 'Optimize your power infrastructure with the BRMU Battery Rack Management Unit. Ideal for grid, renewable, residential energy storage, and UPS.',
    },
  },
  {
    slug: 'ems-c',
    name: 'EMS-C',
    featured: true,
    fullName: {
      en: 'Energy Management System - Commercial',
      ja: 'エネルギー管理システム — 業務用',
    },
    category: 'EMS',
    searchKeywords: {
      en: ['commercial energy management', 'commercial EMS', 'BESS cabinet controller'],
      ja: ['業務用エネルギー管理', '商用EMS', 'BESSキャビネット', 'エネルギー管理'],
    },
    image: { src: 'ems-c.jpg' },
    features: {
      en: [
        'Quad-core 1.8 GHz CPU',
        '2GB LPDDR4 and 256GB SSD',
        'Multiple DO and DI interfaces for other devices in cabinet',
        'Multiple LAN, CAN and RS485 interfaces for other devices in cabinet',
        'The local control core of the BESS cabinet can achieve scheduled charge and discharge, profit analysis, and equipment management functions',
      ],
      ja: [
        'クアッドコア 1.8 GHz CPU 搭載',
        '2GB LPDDR4 および 256GB SSD',
        'キャビネット内他デバイス接続用の多チャンネルDO/DIインターフェース',
        'キャビネット内他デバイス接続用の多チャンネルLAN/CAN/RS485インターフェース',
        'BESSキャビネットのローカル制御コアとして、計画充放電、収益分析、および機器管理機能を実現',
      ],
    },
    applications: {
      en: ['Grid Energy Storage', 'Renewable Energy Systems'],
      ja: ['系統用蓄電池システム', '再生可能エネルギーシステム'],
    },
    metadata: {
      title: 'EMS-C Commercial Energy Management | BMTech',
      description: 'Optimize your power infrastructure with the EMS-C Commercial Energy Management System. Ideal for grid energy storage and renewable energy systems.',
    },
  },
  {
    slug: 'iot-b10',
    name: 'IOT-B10',
    featured: true,
    fullName: { en: 'IOT-B10', ja: '' },
    category: 'EMS',
    searchKeywords: {
      en: ['data communication terminal', 'remote monitoring', 'telemetry', 'firmware update'],
      ja: ['データ通信端末', '遠隔監視', 'テレメトリ', 'ファームウェア更新'],
    },
    image: { src: 'IOT-B10.jpg' },
    features: {
      en: [
        'Supports remote BMS program and firmware updates',
        'Enables continuous, real-time telemetry and system data uploads',
      ],
      ja: [
        '遠隔でのBMSプログラムおよびファームウェアのアップデートに対応',
        '継続的なリアルタイムのテレメトリ（遠隔測定）およびシステムデータのアップロードが可能',
      ],
    },
    applications: {
      en: ['Grid Energy Storage', 'Renewable Energy Systems'],
      ja: ['系統用蓄電池システム', '再生可能エネルギーシステム'],
    },
    metadata: {
      title: 'IOT-B10 Data Communication Terminal | BMTech',
      description: 'Optimize your power infrastructure with the IOT-B10 system. Ideal for high-performance grid energy storage and renewable energy systems. Learn more.',
    },
  },
  {
    slug: 'smc-gateway',
    name: 'SMC-Gateway',
    featured: true,
    fullName: {
      en: 'Station Management Controller - Gateway',
      ja: 'ステーション管理コントローラー — ゲートウェイ',
    },
    category: 'EMS',
    searchKeywords: {
      en: ['station management controller', 'gateway', 'battery container display'],
      ja: ['ステーション管理コントローラー', 'ゲートウェイ', 'バッテリーコンテナ表示'],
    },
    image: { src: 'smc-gateway.jpg' },
    features: {
      en: [
        'Quad-core Cortex-A55 2.0 GHz CPU',
        '2GB LPDDR4 and 128GB TF-card/SSD',
        '10.1-inch screen as the display center of battery container',
        'Multiple DO and DI interfaces for other devices in battery container',
        'Multiple CAN and RS485 interfaces for other devices in battery container',
        'Supports dual-channel communication with SMC-server',
      ],
      ja: [
        'クアッドコア Cortex-A55 2.0 GHz CPU 搭載',
        '2GB LPDDR4 および 128GB TFカード/SSD',
        'バッテリーコンテナの表示センターとして機能する10.1インチスクリーン',
        'コンテナ内他デバイス接続用の多チャンネルDO/DIインターフェース',
        'コンテナ内他設備接続用の多チャンネルCAN/RS485インターフェース',
        'SMCサーバーとの2系統（デュアルチャンネル）通信に対応',
      ],
    },
    applications: {
      en: ['Grid Energy Storage', 'Renewable Energy Systems'],
      ja: ['系統用蓄電池システム', '再生可能エネルギーシステム'],
    },
    metadata: {
      title: 'SMC-Gateway Station Controller | BMTech',
      description: 'Optimize your power infrastructure with the SMC-Gateway Station Management Controller. Ideal for grid energy storage and renewable energy systems.',
    },
  },
  {
    slug: 'smc-server',
    name: 'SMC-Server',
    featured: true,
    fullName: {
      en: 'Station Management Controller - Server',
      ja: 'ステーション管理コントローラー — サーバー',
    },
    category: 'EMS',
    searchKeywords: {
      en: ['station management controller', 'server', 'power station data'],
      ja: ['ステーション管理コントローラー', 'サーバー', '発電所データ', '蓄電所データ'],
    },
    image: { src: 'smc-server.jpg' },
    features: {
      en: [
        'X86 CPU with Linux operating system',
        'Dimension compatible with 19-inch cabinet with 1U height',
        'Expandable database, performing full life-cycle data storage of power station',
        'Supports program upgrade, parameter setting and device management',
        'Display of station operation data, real-time refresh of alarm data',
      ],
      ja: [
        'Linuxオペレーティングシステム搭載のX86 CPU',
        '1Uサイズの19インチキャビネットに対応する寸法',
        '拡張可能なデータベースにより、発電所のライフサイクル全体のデータストレージを実行',
        'プログラムのアップグレード、パラメータ設定、およびデバイス管理に対応',
        'ステーション運転データの表示およびアラームデータのリアルタイム更新',
      ],
    },
    applications: {
      en: ['Grid Energy Storage', 'Renewable Energy Systems'],
      ja: ['系統用蓄電池システム', '再生可能エネルギーシステム'],
    },
    metadata: {
      title: 'SMC-Server Station Controller | BMTech',
      description: 'Optimize your power infrastructure with the SMC-Server Station Management Controller. Ideal for grid energy storage and renewable energy systems.',
    },
  },
];

export function sortProductsBySlug<T extends { slug: string }>(items: readonly T[]): T[] {
  return [...items].sort((first, second) => first.slug.localeCompare(second.slug));
}

export function getRelatedProducts(product: Product, items: readonly Product[]): Product[] {
  return sortProductsBySlug(
    items.filter((candidate) => candidate.category === product.category && candidate.slug !== product.slug),
  );
}
