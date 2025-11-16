# Scripts

このディレクトリには、データベースのシードやメンテナンス用のスクリプトが含まれています。

## 経験タイプのシード

### コマンド
```bash
npm run seed:experience
```

### 概要
`src/constants/experiences.ts` で定義された経験タイプデータを `MstExperienceType` テーブルに挿入します。

### 機能
- **安全性**: 既存のユーザーデータがある場合は削除せずにupsertで更新
- **冪等性**: 何度実行しても同じ結果になる
- **詳細ログ**: 処理の進行状況と結果を詳しく表示
- **エラーハンドリング**: エラーが発生した場合の適切な処理

### 実行例
```
🌱 Starting experience types seeding...
🗑️  Deleting existing experience types...
📝 Prepared 142 experience types for seeding

✅ Experience types seeding completed successfully!
📊 Summary:
   • Total processed: 142
   • Inserted/Updated: 142

🏭 Industry breakdown:
   • FOOD: 10 experiences
   • RETAIL: 8 experiences
   • HOSPITALITY: 6 experiences
   ...

📈 Total experience types in database: 142
🔌 Database connection closed
🎉 Seeding completed!
```

### 注意事項
- 実行前にPrismaのマイグレーションが完了していることを確認してください
- 既存のユーザー経験データがある場合は、経験タイプの削除は行われません
- 本番環境では十分注意して実行してください

### 開発時の使用例
1. **初回セットアップ時**
   ```bash
   npx prisma migrate dev
   npm run seed:experience
   ```

2. **新しい経験タイプを追加後**
   ```bash
   # constants/experiences.ts を更新後
   npm run seed:experience
   ```

3. **データの整合性確認**
   ```bash
   npm run seed:experience  # 冪等性により既存データは保護される
   ```