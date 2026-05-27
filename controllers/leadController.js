import Lead from "../models/Lead.js";

export const createLead = async (
  req,
  res
) => {

  try {

    const lead = await Lead.create(
      req.body
    );

    res.status(201).json(lead);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};