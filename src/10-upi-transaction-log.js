/**
 * 💸 UPI Transaction Log Analyzer
 *
 * Aaj kal sab UPI pe chalta hai! Tujhe ek month ke transactions ka log
 * milega, aur tujhe pura analysis karna hai - kitna aaya, kitna gaya,
 * kiski saath zyada transactions hue, etc.
 *
 * Rules:
 *   - transactions is array of objects:
 *     [{ id: "TXN001", type: "credit"/"debit", amount: 500,
 *        to: "Rahul", category: "food", date: "2025-01-15" }, ...]
 *   - Skip transactions where amount is not a positive number
 *   - Skip transactions where type is not "credit" or "debit"
 *   - Calculate (on valid transactions only):
 *     - totalCredit: sum of all "credit" type amounts
 *     - totalDebit: sum of all "debit" type amounts
 *     - netBalance: totalCredit - totalDebit
 *     - transactionCount: total number of valid transactions
 *     - avgTransaction: Math.round(sum of all valid amounts / transactionCount)
 *     - highestTransaction: the full transaction object with highest amount
 *     - categoryBreakdown: object with category as key and total amount as value
 *       e.g., { food: 1500, travel: 800 } (include both credit and debit)
 *     - frequentContact: the "to" field value that appears most often
 *       (if tie, return whichever appears first)
 *     - allAbove100: boolean, true if every valid transaction amount > 100 (use every)
 *     - hasLargeTransaction: boolean, true if some valid amount >= 5000 (use some)
 *   - Hint: Use filter(), reduce(), sort(), find(), every(), some(),
 *     Object.entries(), Math.round(), typeof
 *
 * Validation:
 *   - Agar transactions array nahi hai ya empty hai, return null
 *   - Agar after filtering invalid transactions, koi valid nahi bacha, return null
 *
 * @param {Array<{ id: string, type: string, amount: number, to: string, category: string, date: string }>} transactions
 * @returns {{ totalCredit: number, totalDebit: number, netBalance: number, transactionCount: number, avgTransaction: number, highestTransaction: object, categoryBreakdown: object, frequentContact: string, allAbove100: boolean, hasLargeTransaction: boolean } | null}
 *
 * @example
 *   analyzeUPITransactions([
 *     { id: "T1", type: "credit", amount: 5000, to: "Salary", category: "income", date: "2025-01-01" },
 *     { id: "T2", type: "debit", amount: 200, to: "Swiggy", category: "food", date: "2025-01-02" },
 *     { id: "T3", type: "debit", amount: 100, to: "Swiggy", category: "food", date: "2025-01-03" }
 *   ])
 *   // => { totalCredit: 5000, totalDebit: 300, netBalance: 4700,
 *   //      transactionCount: 3, avgTransaction: 1767,
 *   //      highestTransaction: { id: "T1", ... },
 *   //      categoryBreakdown: { income: 5000, food: 300 },
 *   //      frequentContact: "Swiggy", allAbove100: false, hasLargeTransaction: true }
 */
export function analyzeUPITransactions(transactions) {
  // Your code here
  // 1. Initial Validation
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return null;
  }

  // 2. Filter Valid Transactions
  // Amount > 0 and Type must be 'credit' or 'debit'
  const validTxns = transactions.filter((txn) => {
    const isValidAmount = typeof txn.amount === "number" && txn.amount > 0;
    const isValidType = txn.type === "credit" || txn.type === "debit";
    return isValidAmount && isValidType;
  });

  // 3. Post-filter Validation
  if (validTxns.length === 0) {
    return null;
  }

  // 4. Initialize accumulators
  let totalCredit = 0;
  let totalDebit = 0;
  let totalValidAmountSum = 0;
  let highestTransaction = validTxns[0];
  const categoryBreakdown = {};
  const contactCounts = {};

  // 5. Single-pass Analysis
  validTxns.forEach((txn) => {
    // Totals logic
    if (txn.type === "credit") totalCredit += txn.amount;
    if (txn.type === "debit") totalDebit += txn.amount;
    totalValidAmountSum += txn.amount;

    // Highest Transaction logic
    if (txn.amount > highestTransaction.amount) {
      highestTransaction = txn;
    }

    // Category Breakdown logic
    categoryBreakdown[txn.category] = (categoryBreakdown[txn.category] || 0) + txn.amount;

    // Contact frequency logic
    contactCounts[txn.to] = (contactCounts[txn.to] || 0) + 1;
  });

  // 6. Find Frequent Contact (Handle ties by first appearance)
  let frequentContact = "";
  let maxCount = 0;
  
  // We extract unique contacts in their original order of appearance
  const uniqueContactsOrder = [...new Set(validTxns.map(t => t.to))];
  
  uniqueContactsOrder.forEach(contact => {
    if (contactCounts[contact] > maxCount) {
      maxCount = contactCounts[contact];
      frequentContact = contact;
    }
  });

  // 7. Final Calculations & Return
  return {
    totalCredit,
    totalDebit,
    netBalance: totalCredit - totalDebit,
    transactionCount: validTxns.length,
    avgTransaction: Math.round(totalValidAmountSum / validTxns.length),
    highestTransaction,
    categoryBreakdown,
    frequentContact,
    allAbove100: validTxns.every((t) => t.amount > 100),
    hasLargeTransaction: validTxns.some((t) => t.amount >= 5000),
  };
}

