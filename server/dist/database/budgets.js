"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBudgetByUser = exports.createBudget = void 0;
const db_1 = __importDefault(require("../config/db"));
async function createBudget(amount, userId) {
    const query = `
    INSERT INTO budgets 
        (user_id, budget_amount)
    VALUES 
        ($1, $2)
    ON CONFLICT 
      (user_id)
    DO UPDATE SET
      budget_amount = $2
    RETURNING *
    `;
    const values = [userId, amount];
    const { rows } = await db_1.default.query(query, values);
    return rows[0];
}
exports.createBudget = createBudget;
async function getBudgetByUser(userId, date) {
    const query = `
  SELECT
    budgets.id,
    budgets.budget_amount,
    budgets.user_id,
    COALESCE(SUM(t.amount), 0) AS total_spending
  FROM
    budgets
  LEFT JOIN
    transactions t ON budgets.user_id = t.user_id
    AND DATE_TRUNC('MONTH', t.date) = DATE_TRUNC('MONTH', CAST('${date}' AS DATE))
    AND DATE_TRUNC('YEAR', t.date) = DATE_TRUNC('YEAR', CAST('${date}' AS DATE))
  WHERE
    budgets.user_id = $1
  GROUP BY
    budgets.id,
    budgets.budget_amount,
    budgets.user_id;
  `;
    const values = [userId];
    const { rows } = await db_1.default.query(query, values);
    if (rows.length === 0) {
        return [];
    }
    else {
        return rows[0];
    }
}
exports.getBudgetByUser = getBudgetByUser;
//# sourceMappingURL=budgets.js.map