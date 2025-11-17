import type { IndustryType } from '@prisma/client'

// 経験タイプの定義
export interface ExperienceTypeData {
  id: string
  title: string
  industry: IndustryType
}

// ここでの情報がMstExperienceTypeテーブルにシードされるデータとなる
export const INDUSTRY_EXPERIENCES: Record<IndustryType, ExperienceTypeData[]> = {
  FOOD: [
    { id: 'foodBarista', title: 'Barista', industry: 'FOOD' }, // バリスタ
    { id: 'foodCashier', title: 'Cashier', industry: 'FOOD' }, // レジ担当
    { id: 'foodServer', title: 'Server', industry: 'FOOD' }, // 接客スタッフ
    { id: 'foodCook', title: 'Cook', industry: 'FOOD' }, // 調理スタッフ
    { id: 'foodKitchenHelper', title: 'Kitchen Helper', industry: 'FOOD' }, // キッチン補助
    { id: 'foodBaking', title: 'Baking', industry: 'FOOD' }, // パン製造
    { id: 'foodPastryChef', title: 'Pastry Chef', industry: 'FOOD' }, // パティシエ
    { id: 'foodPreparation', title: 'Food Preparation', industry: 'FOOD' }, // 調理前準備
    { id: 'foodBartender', title: 'Bartender', industry: 'FOOD' }, // バーテンダー
    { id: 'foodSommelier', title: 'Sommelier', industry: 'FOOD' }, // ソムリエ
  ],

  RETAIL: [
    { id: 'retailSalesAssociate', title: 'Sales Associate', industry: 'RETAIL' }, // 販売スタッフ
    { id: 'retailCashier', title: 'Cashier', industry: 'RETAIL' }, // レジ担当
    { id: 'retailCustomerService', title: 'Customer Service', industry: 'RETAIL' }, // カスタマーサービス
    { id: 'retailMerchandising', title: 'Merchandising', industry: 'RETAIL' }, // 商品陳列
    { id: 'retailStockingShelves', title: 'Stocking Shelves', industry: 'RETAIL' }, // 棚補充
    { id: 'retailInventoryCount', title: 'Inventory Count', industry: 'RETAIL' }, // 在庫カウント
    { id: 'retailProductDisplay', title: 'Product Display', industry: 'RETAIL' }, // 商品ディスプレイ
    { id: 'retailFittingRoomStaff', title: 'Fitting Room Staff', industry: 'RETAIL' }, // 試着室対応
  ],

  HOSPITALITY: [
    { id: 'hospitalityFrontDesk', title: 'Front Desk', industry: 'HOSPITALITY' }, // フロント対応
    { id: 'hospitalityRoomAttendant', title: 'Room Attendant', industry: 'HOSPITALITY' }, // 客室清掃
    { id: 'hospitalityGuestService', title: 'Guest Service', industry: 'HOSPITALITY' }, // ゲスト対応
    { id: 'hospitalityHousekeeping', title: 'Housekeeping', industry: 'HOSPITALITY' }, // ハウスキーピング
    { id: 'hospitalityLaundryStaff', title: 'Laundry Staff', industry: 'HOSPITALITY' }, // ランドリースタッフ
    { id: 'hospitalityBanquetServer', title: 'Banquet Server', industry: 'HOSPITALITY' }, // 宴会サービス
  ],

  HEALTHCARE: [
    { id: 'healthcareCaregiver', title: 'Caregiver', industry: 'HEALTHCARE' }, // 介護スタッフ
    { id: 'healthcareSupportWorker', title: 'Support Worker', industry: 'HEALTHCARE' }, // 支援スタッフ
    { id: 'healthcareClinicAssistant', title: 'Clinic Assistant', industry: 'HEALTHCARE' }, // 医療アシスタント
    { id: 'healthcarePatientSupport', title: 'Patient Support', industry: 'HEALTHCARE' }, // 患者サポート
  ],

  BEAUTY: [
    { id: 'beautyHairAssistant', title: 'Hair Assistant', industry: 'BEAUTY' }, // 美容師アシスタント
    { id: 'beautyNailArtist', title: 'Nail Artist', industry: 'BEAUTY' }, // ネイルアーティスト
    { id: 'beautyEsthetician', title: 'Esthetician', industry: 'BEAUTY' }, // エステスタッフ
    { id: 'beautySalonReception', title: 'Salon Reception', industry: 'BEAUTY' }, // サロン受付
  ],

  DELIVERY: [
    { id: 'deliveryFoodDelivery', title: 'Food Delivery', industry: 'DELIVERY' }, // フードデリバリー
    { id: 'deliveryParcelDelivery', title: 'Parcel Delivery', industry: 'DELIVERY' }, // 配達業務
    { id: 'deliveryBikeCourier', title: 'Bike Courier', industry: 'DELIVERY' }, // 自転車配達
    { id: 'deliveryDriverAssistant', title: 'Driver Assistant', industry: 'DELIVERY' }, // 配送助手
  ],

  FITNESS: [
    { id: 'fitnessGymStaff', title: 'Gym Staff', industry: 'FITNESS' }, // ジムスタッフ
    { id: 'fitnessTrainerAssistant', title: 'Trainer Assistant', industry: 'FITNESS' }, // トレーナー補助
    { id: 'fitnessFrontDesk', title: 'Front Desk', industry: 'FITNESS' }, // フロント業務
    { id: 'fitnessClassSupport', title: 'Class Support', industry: 'FITNESS' }, // クラスサポート
  ],

  LOGISTICS: [
    { id: 'logisticsWarehouseWorker', title: 'Warehouse Worker', industry: 'LOGISTICS' }, // 倉庫作業
    { id: 'logisticsPackingStaff', title: 'Packing Staff', industry: 'LOGISTICS' }, // 梱包
    { id: 'logisticsSortingStaff', title: 'Sorting Staff', industry: 'LOGISTICS' }, // 仕分け
    { id: 'logisticsForkliftOperator', title: 'Forklift Operator', industry: 'LOGISTICS' }, // フォークリフト運転
    { id: 'logisticsShippingHandling', title: 'Shipping Handling', industry: 'LOGISTICS' }, // 出荷対応
  ],

  EDUCATION: [
    { id: 'educationTutor', title: 'Tutor', industry: 'EDUCATION' }, // 個別指導
    { id: 'educationTeachingAssistant', title: 'Teaching Assistant', industry: 'EDUCATION' }, // 授業アシスタント
    { id: 'educationLessonSupport', title: 'Lesson Support', industry: 'EDUCATION' }, // 授業サポート
    { id: 'educationLanguageTeaching', title: 'Language Teaching', industry: 'EDUCATION' }, // 語学指導
  ],

  CORPORATE: [
    { id: 'corporateInsideSales', title: 'Inside Sales', industry: 'CORPORATE' }, // 内勤営業
    { id: 'corporatePhoneSales', title: 'Phone Sales', industry: 'CORPORATE' }, // 電話営業
    { id: 'corporateCustomerSuccess', title: 'Customer Success', industry: 'CORPORATE' }, // カスタマーサクセス
    { id: 'corporateAccountSupport', title: 'Account Support', industry: 'CORPORATE' }, // アカウントサポート
    { id: 'corporateAdminAssistant', title: 'Admin Assistant', industry: 'CORPORATE' }, // 事務アシスタント
    { id: 'corporateOfficeAssistant', title: 'Office Assistant', industry: 'CORPORATE' }, // オフィス業務
    { id: 'corporateReceptionDesk', title: 'Reception Desk', industry: 'CORPORATE' }, // 受付
  ],

  ADMIN: [
    { id: 'adminAdminAssistant', title: 'Admin Assistant', industry: 'ADMIN' }, // 管理部アシスタント
    { id: 'adminGeneralAdmin', title: 'General Admin', industry: 'ADMIN' }, // 総務業務
    { id: 'adminHrSupport', title: 'HR Support', industry: 'ADMIN' }, // 人事サポート
    { id: 'adminHiringSupport', title: 'Hiring Support', industry: 'ADMIN' }, // 採用サポート
    { id: 'adminDocumentHandling', title: 'Document Handling', industry: 'ADMIN' }, // 書類対応
    { id: 'adminOfficeSupport', title: 'Office Support', industry: 'ADMIN' }, // オフィス業務
    { id: 'adminDataEntry', title: 'Data Entry', industry: 'ADMIN' }, // データ入力
  ],

  FINANCE: [
    { id: 'financeAccountingSupport', title: 'Accounting Support', industry: 'FINANCE' }, // 経理サポート
    { id: 'financeBookkeeping', title: 'Bookkeeping', industry: 'FINANCE' }, // 記帳
    { id: 'financeBillingAssistant', title: 'Billing Assistant', industry: 'FINANCE' }, // 請求処理
    { id: 'financePayrollSupport', title: 'Payroll Support', industry: 'FINANCE' }, // 給与処理補助
    { id: 'financeInvoiceProcessing', title: 'Invoice Processing', industry: 'FINANCE' }, // 請求対応
    { id: 'financeExpenseTracking', title: 'Expense Tracking', industry: 'FINANCE' }, // 経費管理
  ],

  TECH: [
    { id: 'techFrontendDev', title: 'Frontend Dev', industry: 'TECH' }, // フロントエンド開発
    { id: 'techBackendDev', title: 'Backend Dev', industry: 'TECH' }, // バックエンド開発
    { id: 'techFullstackDev', title: 'Fullstack Dev', industry: 'TECH' }, // フルスタック開発
    { id: 'techUiUxDesign', title: 'UI/UX Design', industry: 'TECH' }, // UI/UXデザイン
    { id: 'techQaTesting', title: 'QA Testing', industry: 'TECH' }, // テスト・QA
    { id: 'techItSupport', title: 'IT Support', industry: 'TECH' }, // ITサポート
    { id: 'techApiDevelopment', title: 'API Development', industry: 'TECH' }, // API開発
    { id: 'techDatabaseDesign', title: 'Database Design', industry: 'TECH' }, // データベース設計
  ],

  MARKETING: [
    { id: 'marketingSocialMedia', title: 'Social Media', industry: 'MARKETING' }, // SNS運用
    { id: 'marketingDigitalMarketing', title: 'Digital Marketing', industry: 'MARKETING' }, // デジタルマーケ
    { id: 'marketingEmailMarketing', title: 'Email Marketing', industry: 'MARKETING' }, // メールマーケ
    { id: 'marketingMarketResearch', title: 'Market Research', industry: 'MARKETING' }, // 市場調査
    { id: 'marketingEventPromotion', title: 'Event Promotion', industry: 'MARKETING' }, // イベント販促
    { id: 'marketingCampaignSupport', title: 'Campaign Support', industry: 'MARKETING' }, // キャンペーン補助
  ],

  MEDIA: [
    { id: 'mediaPhotographer', title: 'Photographer', industry: 'MEDIA' }, // 写真撮影
    { id: 'mediaVideoEditing', title: 'Video Editing', industry: 'MEDIA' }, // 動画編集
    { id: 'mediaFilming', title: 'Filming', industry: 'MEDIA' }, // 撮影
    { id: 'mediaContentCreation', title: 'Content Creation', industry: 'MEDIA' }, // コンテンツ制作
    { id: 'mediaGraphicDesign', title: 'Graphic Design', industry: 'MEDIA' }, // グラフィックデザイン
    { id: 'mediaCopywriting', title: 'Copywriting', industry: 'MEDIA' }, // コピーライティング
    { id: 'mediaScriptWriting', title: 'Script Writing', industry: 'MEDIA' }, // 脚本
    { id: 'mediaPodcastEditing', title: 'Podcast Editing', industry: 'MEDIA' }, // ポッドキャスト編集
    { id: 'mediaLiveStreaming', title: 'Live Streaming', industry: 'MEDIA' }, // ライブ配信
    { id: 'mediaMotionGraphics', title: 'Motion Graphics', industry: 'MEDIA' }, // モーショングラフィックス
    { id: 'mediaPhotoRetouching', title: 'Photo Retouching', industry: 'MEDIA' }, // 写真レタッチ
  ],
} as const
