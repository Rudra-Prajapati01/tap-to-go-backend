import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";


export const createContact = async (req, res) => {
  try {

    const {
      name,
      email,
      phone,
      company,
      message,
    } = req.body;

    const formattedPhone =
      phone && !phone.startsWith("+91")
        ? `+91 ${phone}`
        : phone || "N/A";

    const contact = await Contact.create(req.body);

    const transporter =
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "Easytapofficial@gmail.com",
      subject: "🚀 New Contact Form Submission",

      html: `
          <!DOCTYPE html>
          <html>
          <head>
          <meta charset="UTF-8" />
          </head>

          <body style="
            margin:0;
            padding:0;
            background:#f4f7fb;
            font-family:Arial,sans-serif;
          ">

          <div style="
            max-width:650px;
            margin:40px auto;
            background:#ffffff;
            border-radius:20px;
            overflow:hidden;
            box-shadow:0 10px 30px rgba(0,0,0,0.08);
          ">

            <div style="
              background:linear-gradient(135deg,#0B4DBB 0%,#4CAF1D 100%);
              padding:35px;
              text-align:center;
            ">
              <h1 style="
                margin:0;
                color:#fff;
                font-size:30px;
              ">
                🚀 New Contact Request
              </h1>

              <p style="
                margin-top:10px;
                color:#fff;
                opacity:0.9;
                font-size:14px;
              ">
                EasyTap Contact Form Submission
              </p>
            </div>

            <div style="padding:35px;">

              <div style="
                background:#F8FAFC;
                border:1px solid #E5E7EB;
                border-radius:16px;
                padding:20px;
                margin-bottom:20px;
              ">

                <p><strong>👤 Name:</strong> ${name}</p>

                <p><strong>📧 Email:</strong> ${email}</p>

                <p><strong>📱 Phone:</strong> ${formattedPhone}</p>
                
                <p><strong>🏢 Company:</strong> ${company || "N/A"}</p>

              </div>

              <h3 style="
                color:#111827;
                margin-bottom:10px;
              ">
                💬 Message
              </h3>

              <div style="
                background:#F9FAFB;
                border-left:4px solid #0B4DBB;
                padding:18px;
                border-radius:12px;
                color:#374151;
                line-height:1.7;
              ">
                ${message}
              </div>

            </div>

            <div style="
              background:#F9FAFB;
              padding:20px;
              text-align:center;
              border-top:1px solid #E5E7EB;
            ">

              <p style="
                margin:0;
                color:#6B7280;
                font-size:13px;
              ">
                Sent from EasyTap Contact Form
              </p>

              <p style="
                margin-top:8px;
                color:#9CA3AF;
                font-size:12px;
              ">
                © 2026 EasyTap • Smart NFC Business Cards
              </p>

            </div>

          </div>

          </body>
          </html>
          `
    });

    res.status(201).json({
      success: true,
      contact,
    });

  } catch (error) {

    console.log("CONTACT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// GET ALL
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      contacts,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE
export const deleteContact = async (req, res) => {
  try {

    const contact =
      await Contact.findByIdAndDelete(
        req.params.id
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};