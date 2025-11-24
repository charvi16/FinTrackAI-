import { calculateEmergencyFund } from "../utils/calcEmergencyFund.js";

export const getEmergencyFund = (req, res) => {
  try {
    const data = req.body; // essentialExpenses, jobRisk, dependents...

    const result = calculateEmergencyFund(data);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Emergency Fund Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
