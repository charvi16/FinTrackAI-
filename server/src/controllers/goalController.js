import Goal from "../models/goalModel.js";

// POST /api/goals
export const createGoal = async (req, res) => {
  try {
    const { title, price, timeline, category, aiAdvice } = req.body;

    const goal = await Goal.create({
      user: req.user._id,
      title,
      price,
      timeline,
      category,
      aiAdvice,
      progress: 0,
      completed: false,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/goals
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/goals/:id
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ message: "Goal not found" });
    if (goal.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    Object.assign(goal, req.body);
    await goal.save();

    res.json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/goals/:id
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ message: "Goal not found" });
    if (goal.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    await goal.deleteOne();
    res.json({ message: "Goal deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark goal complete
export const toggleComplete = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    goal.completed = !goal.completed;
    await goal.save();

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update progress (0–100)
export const updateProgress = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    goal.progress = req.body.progress;
    await goal.save();

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
