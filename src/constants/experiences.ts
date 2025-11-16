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
    { id: 'food_barista', title: 'Barista', industry: 'FOOD' }, // バリスタ
    { id: 'food_cashier', title: 'Cashier', industry: 'FOOD' }, // レジ担当
    { id: 'food_server', title: 'Server', industry: 'FOOD' }, // 接客スタッフ
    { id: 'food_cook', title: 'Cook', industry: 'FOOD' }, // 調理スタッフ
    { id: 'food_kitchen_helper', title: 'Kitchen Helper', industry: 'FOOD' }, // キッチン補助
    { id: 'food_baking', title: 'Baking', industry: 'FOOD' }, // パン製造
    { id: 'food_pastry_chef', title: 'Pastry Chef', industry: 'FOOD' }, // パティシエ
    { id: 'food_preparation', title: 'Food Preparation', industry: 'FOOD' }, // 調理前準備
    { id: 'food_bartender', title: 'Bartender', industry: 'FOOD' }, // バーテンダー
    { id: 'food_sommelier', title: 'Sommelier', industry: 'FOOD' }, // ソムリエ
  ],

  RETAIL: [
    { id: 'retail_sales_associate', title: 'Sales Associate', industry: 'RETAIL' }, // 販売スタッフ
    { id: 'retail_cashier', title: 'Cashier', industry: 'RETAIL' }, // レジ担当
    { id: 'retail_customer_service', title: 'Customer Service', industry: 'RETAIL' }, // カスタマーサービス
    { id: 'retail_merchandising', title: 'Merchandising', industry: 'RETAIL' }, // 商品陳列
    { id: 'retail_stocking_shelves', title: 'Stocking Shelves', industry: 'RETAIL' }, // 棚補充
    { id: 'retail_inventory_count', title: 'Inventory Count', industry: 'RETAIL' }, // 在庫カウント
    { id: 'retail_product_display', title: 'Product Display', industry: 'RETAIL' }, // 商品ディスプレイ
    { id: 'retail_fitting_room_staff', title: 'Fitting Room Staff', industry: 'RETAIL' }, // 試着室対応
  ],

  HOSPITALITY: [
    { id: 'hospitality_front_desk', title: 'Front Desk', industry: 'HOSPITALITY' }, // フロント対応
    { id: 'hospitality_room_attendant', title: 'Room Attendant', industry: 'HOSPITALITY' }, // 客室清掃
    { id: 'hospitality_guest_service', title: 'Guest Service', industry: 'HOSPITALITY' }, // ゲスト対応
    { id: 'hospitality_housekeeping', title: 'Housekeeping', industry: 'HOSPITALITY' }, // ハウスキーピング
    { id: 'hospitality_laundry_staff', title: 'Laundry Staff', industry: 'HOSPITALITY' }, // ランドリースタッフ
    { id: 'hospitality_banquet_server', title: 'Banquet Server', industry: 'HOSPITALITY' }, // 宴会サービス
  ],

  HEALTHCARE: [
    { id: 'healthcare_caregiver', title: 'Caregiver', industry: 'HEALTHCARE' }, // 介護スタッフ
    { id: 'healthcare_support_worker', title: 'Support Worker', industry: 'HEALTHCARE' }, // 支援スタッフ
    { id: 'healthcare_clinic_assistant', title: 'Clinic Assistant', industry: 'HEALTHCARE' }, // 医療アシスタント
    { id: 'healthcare_patient_support', title: 'Patient Support', industry: 'HEALTHCARE' }, // 患者サポート
  ],

  BEAUTY: [
    { id: 'beauty_hair_assistant', title: 'Hair Assistant', industry: 'BEAUTY' }, // 美容師アシスタント
    { id: 'beauty_nail_artist', title: 'Nail Artist', industry: 'BEAUTY' }, // ネイルアーティスト
    { id: 'beauty_esthetician', title: 'Esthetician', industry: 'BEAUTY' }, // エステスタッフ
    { id: 'beauty_salon_reception', title: 'Salon Reception', industry: 'BEAUTY' }, // サロン受付
  ],

  DELIVERY: [
    { id: 'delivery_food_delivery', title: 'Food Delivery', industry: 'DELIVERY' }, // フードデリバリー
    { id: 'delivery_parcel_delivery', title: 'Parcel Delivery', industry: 'DELIVERY' }, // 配達業務
    { id: 'delivery_bike_courier', title: 'Bike Courier', industry: 'DELIVERY' }, // 自転車配達
    { id: 'delivery_driver_assistant', title: 'Driver Assistant', industry: 'DELIVERY' }, // 配送助手
  ],

  FITNESS: [
    { id: 'fitness_gym_staff', title: 'Gym Staff', industry: 'FITNESS' }, // ジムスタッフ
    { id: 'fitness_trainer_assistant', title: 'Trainer Assistant', industry: 'FITNESS' }, // トレーナー補助
    { id: 'fitness_front_desk', title: 'Front Desk', industry: 'FITNESS' }, // フロント業務
    { id: 'fitness_class_support', title: 'Class Support', industry: 'FITNESS' }, // クラスサポート
  ],

  LOGISTICS: [
    { id: 'logistics_warehouse_worker', title: 'Warehouse Worker', industry: 'LOGISTICS' }, // 倉庫作業
    { id: 'logistics_packing_staff', title: 'Packing Staff', industry: 'LOGISTICS' }, // 梱包
    { id: 'logistics_sorting_staff', title: 'Sorting Staff', industry: 'LOGISTICS' }, // 仕分け
    { id: 'logistics_forklift_operator', title: 'Forklift Operator', industry: 'LOGISTICS' }, // フォークリフト運転
    { id: 'logistics_shipping_handling', title: 'Shipping Handling', industry: 'LOGISTICS' }, // 出荷対応
  ],

  EDUCATION: [
    { id: 'education_tutor', title: 'Tutor', industry: 'EDUCATION' }, // 個別指導
    { id: 'education_teaching_assistant', title: 'Teaching Assistant', industry: 'EDUCATION' }, // 授業アシスタント
    { id: 'education_lesson_support', title: 'Lesson Support', industry: 'EDUCATION' }, // 授業サポート
    { id: 'education_language_teaching', title: 'Language Teaching', industry: 'EDUCATION' }, // 語学指導
  ],

  CORPORATE: [
    { id: 'corporate_inside_sales', title: 'Inside Sales', industry: 'CORPORATE' }, // 内勤営業
    { id: 'corporate_phone_sales', title: 'Phone Sales', industry: 'CORPORATE' }, // 電話営業
    { id: 'corporate_customer_success', title: 'Customer Success', industry: 'CORPORATE' }, // カスタマーサクセス
    { id: 'corporate_account_support', title: 'Account Support', industry: 'CORPORATE' }, // アカウントサポート
    { id: 'corporate_admin_assistant', title: 'Admin Assistant', industry: 'CORPORATE' }, // 事務アシスタント
    { id: 'corporate_office_assistant', title: 'Office Assistant', industry: 'CORPORATE' }, // オフィス業務
    { id: 'corporate_reception_desk', title: 'Reception Desk', industry: 'CORPORATE' }, // 受付
  ],

  ADMIN: [
    { id: 'admin_admin_assistant', title: 'Admin Assistant', industry: 'ADMIN' }, // 管理部アシスタント
    { id: 'admin_general_admin', title: 'General Admin', industry: 'ADMIN' }, // 総務業務
    { id: 'admin_hr_support', title: 'HR Support', industry: 'ADMIN' }, // 人事サポート
    { id: 'admin_hiring_support', title: 'Hiring Support', industry: 'ADMIN' }, // 採用サポート
    { id: 'admin_document_handling', title: 'Document Handling', industry: 'ADMIN' }, // 書類対応
    { id: 'admin_office_support', title: 'Office Support', industry: 'ADMIN' }, // オフィス業務
    { id: 'admin_data_entry', title: 'Data Entry', industry: 'ADMIN' }, // データ入力
  ],

  FINANCE: [
    { id: 'finance_accounting_support', title: 'Accounting Support', industry: 'FINANCE' }, // 経理サポート
    { id: 'finance_bookkeeping', title: 'Bookkeeping', industry: 'FINANCE' }, // 記帳
    { id: 'finance_billing_assistant', title: 'Billing Assistant', industry: 'FINANCE' }, // 請求処理
    { id: 'finance_payroll_support', title: 'Payroll Support', industry: 'FINANCE' }, // 給与処理補助
    { id: 'finance_invoice_processing', title: 'Invoice Processing', industry: 'FINANCE' }, // 請求対応
    { id: 'finance_expense_tracking', title: 'Expense Tracking', industry: 'FINANCE' }, // 経費管理
  ],

  TECH: [
    { id: 'tech_frontend_dev', title: 'Frontend Dev', industry: 'TECH' }, // フロントエンド開発
    { id: 'tech_backend_dev', title: 'Backend Dev', industry: 'TECH' }, // バックエンド開発
    { id: 'tech_fullstack_dev', title: 'Fullstack Dev', industry: 'TECH' }, // フルスタック開発
    { id: 'tech_ui_ux_design', title: 'UI/UX Design', industry: 'TECH' }, // UI/UXデザイン
    { id: 'tech_qa_testing', title: 'QA Testing', industry: 'TECH' }, // テスト・QA
    { id: 'tech_it_support', title: 'IT Support', industry: 'TECH' }, // ITサポート
    { id: 'tech_api_development', title: 'API Development', industry: 'TECH' }, // API開発
    { id: 'tech_database_design', title: 'Database Design', industry: 'TECH' }, // データベース設計
  ],

  MARKETING: [
    { id: 'marketing_social_media', title: 'Social Media', industry: 'MARKETING' }, // SNS運用
    { id: 'marketing_digital_marketing', title: 'Digital Marketing', industry: 'MARKETING' }, // デジタルマーケ
    { id: 'marketing_email_marketing', title: 'Email Marketing', industry: 'MARKETING' }, // メールマーケ
    { id: 'marketing_market_research', title: 'Market Research', industry: 'MARKETING' }, // 市場調査
    { id: 'marketing_event_promotion', title: 'Event Promotion', industry: 'MARKETING' }, // イベント販促
    { id: 'marketing_campaign_support', title: 'Campaign Support', industry: 'MARKETING' }, // キャンペーン補助
  ],

  MEDIA: [
    { id: 'media_photographer', title: 'Photographer', industry: 'MEDIA' }, // 写真撮影
    { id: 'media_video_editing', title: 'Video Editing', industry: 'MEDIA' }, // 動画編集
    { id: 'media_filming', title: 'Filming', industry: 'MEDIA' }, // 撮影
    { id: 'media_content_creation', title: 'Content Creation', industry: 'MEDIA' }, // コンテンツ制作
    { id: 'media_graphic_design', title: 'Graphic Design', industry: 'MEDIA' }, // グラフィックデザイン
    { id: 'media_copywriting', title: 'Copywriting', industry: 'MEDIA' }, // コピーライティング
    { id: 'media_script_writing', title: 'Script Writing', industry: 'MEDIA' }, // 脚本
    { id: 'media_podcast_editing', title: 'Podcast Editing', industry: 'MEDIA' }, // ポッドキャスト編集
    { id: 'media_live_streaming', title: 'Live Streaming', industry: 'MEDIA' }, // ライブ配信
    { id: 'media_motion_graphics', title: 'Motion Graphics', industry: 'MEDIA' }, // モーショングラフィックス
    { id: 'media_photo_retouching', title: 'Photo Retouching', industry: 'MEDIA' }, // 写真レタッチ
  ],
} as const
