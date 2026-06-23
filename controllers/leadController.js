import nodemailer from "nodemailer";
import User from "../models/User.js";
import Lead from "../models/Lead.js";
import Analytics from "../models/Analytics.js";

/* ───────────────────────────── */
/* CREATE LEAD */
/* ───────────────────────────── */

export const createLead = async (req, res) => {
  try {
    console.log("LEAD BODY:", req.body);

    const lead = await Lead.create(req.body);
    console.log("LEAD CREATED");

    // --- EMAIL LOGIC ---
    try {
      const ownerUser = await User.findById(req.body.owner);

      if (ownerUser) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const profileUrl = `https://easytap.co.in/u/${ownerUser.uniqueId}`;

        // 1. OWNER EMAIL (Premium Modern UI Design)
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: ownerUser.email,
          subject: `🔥 New Lead from ${lead.name}`,
          html: `
            <div style="max-width:550px; margin:20px auto; background:#ffffff; border-radius:24px; overflow:hidden; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; box-shadow:0 12px 40px rgba(0,0,0,.08); border: 1px solid #e5e7eb;">
              
              <div style="background:#0B4DBB; padding:30px; text-align:center;">
                <h1 style="color:white; margin:0; font-size:28px; font-weight:800; letter-spacing:0.5px;">EasyTap</h1>
              </div>
              
              <div style="padding:30px; background:#ffffff;">
                <div style="text-align:center; margin-bottom:25px;">
                  <span style="background:#eff6ff; color:#0B4DBB; padding:8px 16px; border-radius:50px; font-size:14px; font-weight:600; display:inline-block;">
                    🎉 Notification
                  </span>
                  <h2 style="margin:15px 0 5px 0; font-size:24px; color:#111827; font-weight:700;">New Lead Received!</h2>
                  <p style="color:#6b7280; font-size:14px; margin:0;">You have got a new connection request via your digital profile.</p>
                </div>

                <div style="background:#f8fafc; border-radius:16px; padding:20px; border:1px solid #f1f5f9; margin-bottom:30px;">
                  <table style="width:100%; border-collapse:collapse;">
                    <tr>
                      <td style="padding:8px 0; color:#6b7280; font-size:14px; width:35%;"><strong>👤 Name:</strong></td>
                      <td style="padding:8px 0; color:#111827; font-size:14px; font-weight:500;">${lead.name}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; color:#6b7280; font-size:14px;"><strong>✉️ Email:</strong></td>
                      <td style="padding:8px 0; color:#111827; font-size:14px; font-weight:500;"><a href="mailto:${lead.email}" style="color:#0B4DBB; text-decoration:none;">${lead.email}</a></td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; color:#6b7280; font-size:14px;"><strong>📞 Phone:</strong></td>
                      <td style="padding:8px 0; color:#111827; font-size:14px; font-weight:500;">${lead.phone}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; color:#6b7280; font-size:14px;"><strong>🏢 Company:</strong></td>
                      <td style="padding:8px 0; color:#111827; font-size:14px; font-weight:500;">${lead.company || "-"}</td>
                    </tr>
                  </table>
                  
                  <hr style="border:0; border-top:1px solid #e2e8f0; margin:15px 0;" />
                  
                  <p style="color:#6b7280; font-size:13px; margin:0 0 8px 0; text-transform:uppercase; font-weight:600; letter-spacing:0.5px;">💬 Message</p>
                  <p style="color:#334155; font-size:14px; line-height:1.5; margin:0; background:#ffffff; padding:12px; border-radius:8px; border:1px solid #e2e8f0;">
                    ${lead.message || "<em>No message provided.</em>"}
                  </p>
                </div>

                <div style="text-align:center;">
                  <a href="${profileUrl}" style="background:#0B4DBB; color:white; padding:14px 32px; border-radius:12px; text-decoration:none; font-weight:600; font-size:15px; display:inline-block; transition:all 0.2s ease; box-shadow:0 4px 12px rgba(11,77,187,0.25);">
                    Open Digital Profile
                  </a>
                </div>
              </div>

              <div style="background:#f9fafb; padding:20px; text-align:center; border-top:1px solid #f1f5f9;">
                <p style="margin:0; color:#9ca3af; font-size:12px;">This is an automated notification from your EasyTap account.</p>
                <p style="margin:6px 0 0 0; font-size:12px;">
                  <a href="https://easytap.co.in" style="color:#0B4DBB; text-decoration:none; font-weight:600;">www.easytap.co.in</a>
                </p>
              </div>
            </div>
          `,
        });

        // 2. LEAD SENDER EMAIL (Tapect Style Premium Template)
        if (lead.email) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: lead.email,
            subject: `🎉 You connected with ${ownerUser.name} on EasyTap`,
            html: `
            <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:28px; overflow:hidden; font-family:Arial,sans-serif; box-shadow:0 20px 50px rgba(0,0,0,.12);">
              
              <div style="height:180px; position:relative; overflow:hidden; background:#0B4DBB;">
                <img src="${ownerUser.coverImage}" style="width:100%; height:180px; object-fit:cover; display:block;" />
                ${ownerUser.logoImage ? `
                <img src="${ownerUser.logoImage}" style="width:60px; height:60px; border-radius:12px; background:#fff; padding:6px; position:absolute; top:15px; left:15px; box-shadow:0 4px 12px rgba(0,0,0,.15);" />
                ` : ""}
              </div>

              <div style="background:#ffffff; padding:25px 25px 0; text-align:center;">
                <h1 style="margin:0; font-size:32px; font-weight:700; color:#111827;">You've made a new connection!</h1>
                <p style="color:#6b7280; margin-top:12px; font-size:15px;">
                  Thank you for connecting with <strong>${ownerUser.name}</strong> through EasyTap.
                </p>
              </div>

              <div style="background:#ffffff; padding:25px; text-align:center;">
                <img src="${ownerUser.profileImage}" style="width:110px; height:110px; border-radius:50%; object-fit:cover; margin-top:-90px; border:5px solid white; box-shadow:0 8px 20px rgba(0,0,0,.15);" />
                
                <h2 style="margin:15px 0 5px 0;">${ownerUser.name}</h2>
                <p style="color:#6b7280; margin:0;">${ownerUser.jobTitle || ""} ${ownerUser.companyName ? ` · ${ownerUser.companyName}` : ""}</p>
                
                <p style="color:#444; line-height:1.6; margin-top:15px;">${ownerUser.bio || ""}</p>

                <div style="background:#f8fafc; border-radius:16px; padding:18px; margin-top:25px;">
                  <p style="margin:10px 0;">📞 ${ownerUser.phone || ""}</p>
                  <p style="margin:10px 0;">✉️ ${ownerUser.email || ""}</p>
                  ${ownerUser.website ? `<p style="margin:10px 0;">🌐 ${ownerUser.website}</p>` : ""}
                </div>

                <div style="text-align:center; margin-top:30px;">
                  <a href="${profileUrl}" style="background:linear-gradient(135deg,#0B4DBB,#2563EB); color:white; padding:16px 32px; border-radius:14px; text-decoration:none; font-weight:700; display:inline-block;">
                    View Digital Profile
                  </a>
                </div>
              </div>

              <div style="background:#f9fafb; padding:25px; text-align:center;">
                <p style="margin:0; color:#6b7280; font-size:13px;">Powered by EasyTap</p>
                <p style="margin-top:10px;">
                  <a href="https://easytap.co.in" style="color:#0B4DBB; text-decoration:none; font-weight:600;">www.easytap.co.in</a>
                </p>
              </div>
            </div>
            `
          });
        }
      }
    } catch (mailError) {
      console.log("MAIL ERROR:", mailError);
    }
    // --- EMAIL LOGIC END ---

    /* ANALYTICS */
    if (req.body.owner) {
      await Analytics.findOneAndUpdate(
        { userId: req.body.owner },
        { $inc: { leads: 1 } },
        { upsert: true, new: true }
      );
      console.log("ANALYTICS UPDATED");
    }

    res.status(201).json(lead);
  } catch (error) {
    console.log("LEAD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* --- Baki functions (getLeads, updateLead, deleteLead) --- */

export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ owner: req.params.ownerId }).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateLead = async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, updatedLead });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Update Failed" });
  }
};

export const deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Delete Failed" });
  }
};