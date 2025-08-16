/**
 * @deprecated このフックは廃止されました。代わりに useFilters を使用してください。
 *
 * 後方互換性のため、このファイルは残されていますが、
 * 新しい実装では hooks/useFilters.ts を使用することを推奨します。
 *
 * 移行ガイド:
 * - useFilterState() → useFilters()
 * - より統合されたAPIと改善されたパフォーマンス
 * - 統一されたオプション管理システム
 */

export { useFilters as useFilterState } from "./useFilters";
