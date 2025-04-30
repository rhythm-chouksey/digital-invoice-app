import React, { useState } from "react";
import axios from "axios";
import "./DigitalInvoiceForm.css";

function DigitalInvoiceForm() {
  // Helper to get current date-time in "DD-MM-YYYY HH:mm:ss" format
  const getCurrentDateTime = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  const defaultFormData = {
    customerInfo: {
      mobile: "9910403116",
      name: "Rhythm",
      email: "rhythm.chouksey@example.com",
      countryCode: "+91",
      gstrName: "Ramandeep",
      gstrMob: "9764775793",
      gstrNo: "217686439898",
    },
    transactionInfo: {
      clientId: "2791182",
      batchId: "9188",
      roc: "159",
      txnId: "0",
      txnType: "UPI",
    },
    orderDetails: {
      storeCode: "9991",
      storeAddress: "Connaught Plaza Restaurants Pvt.Ltd.",
      billingPOSNo: "101",
      netPayableAmount: 13196,
      subTotal: 11782.12,
      rounding: 0,
      taxesInfo: {
        cgstPercent: 9,
        sgstPercent: 9,
        igstPercent: 9,
        utgstPercent: 9,
        cgst: 148.5,
        sgst: 148.5,
        igst: 148.5,
        utgst: 148.5,
      },
      payments: [
        {
          mode: "UPI",
          total: 13196,
          status: "SUCCESS",
        },
      ],
      orderNo: "28",
      orderRegNo: "1",
      productsData: [
        {
          name: "BLACK LOGO PRINT CREW NECK T-SHIRT",
          description: "Premium t-shirt",
          productCode: "A123",
          quantity: 1,
          unitAmount: 300,
          totalAmount: 250,
          hsnCode: "6276462",
          discount: 50,
          taxes: {
            sgstPercent: 6,
            sgst: 8,
            cgstPercent: 6,
            cgst: 8,
            igstPercent: 6,
            igst: 8,
            utgstPercent: 6,
            utgst: 3,
          },
        },
        {
          name: "BLACK LOGO RISE WASHED GLENN SLIM FIT JEANS",
          description: "BLACK LOGO RISE WASHED GLENN SLIM FIT JEANS",
          productCode: "A124",
          quantity: 2,
          unitAmount: 700,
          totalAmount: 1400,
          hsnCode: "6276462",
          discount: 0,
          taxes: {
            sgstPercent: 6,
            sgst: 8,
            cgstPercent: 6,
            cgst: 8,
            igstPercent: 6,
            igst: 8,
            utgstPercent: 6,
            utgst: 3,
          },
        },
      ],
      purchasedPieces: 3,
      invoiceNo: "5286",
      barCode: "",
      loyaltyData: {
        type: "",
        cardNum: "",
        pointsEarned: 0,
        walletAmount: 0,
        amountSaved: 0,
        pointsRedeemed: 0,
      },
      cashierId: "475117",
      cashierName: "Krishna",
      orderDateTime: getCurrentDateTime(), // Set default to current date-time
    },
    billFooterData: {
      disclaimer: "disclaimer testing",
      purchaseTerms: "https://company.co.in/",
      feedbackCode: "LTE123",
      feedbackDiscount: 0,
      feedbackLink: "https://company.co.in/",
      orderInstructions: "Please provide black Umbrella",
      footerInfo:
        "GSTIN-27AAAFH1333H1ZT         \n         GST Classification -         \n    Restaurant Services SAC-996331    \n        FSSAI : 11517007000202        \n We value your feedback. Share it to: \n     myfeedback@mcdonaldsindia.com     \n # The collection of donation is done \n  on behalf of Ronald McDonald House  \nCharities Foundation India (RMHC India)\n  on a principal-to-principal basis.",
    },
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [activeTab, setActiveTab] = useState("customerInfo");
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState("success"); // or "error"
  const [loading, setLoading] = useState(false); // State to track loading

  // Add state for delete confirmation
  const [deleteProductIndex, setDeleteProductIndex] = useState(null);

  // Utility function to format field names
  const formatFieldName = (fieldName) => {
    // Custom label mapping
    const customLabels = {
      barCode: "Barcode Number",
      gstrNo: "Gst Reg No",
      gstrMob: "Gst Reg Mob",
      gstrName: "Gst Reg Name",
      billingPOSNo: "Billing POS No",
      cashierId: "Cashier ID"
    };
    if (customLabels[fieldName]) return customLabels[fieldName];

    return fieldName
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };

  // List of mandatory fields
  const mandatoryFields = {
    customerInfo: ["mobile", "countryCode"],
    transactionInfo: ["clientId", "batchId", "roc"],
    orderDetails: [
      "storeCode",
      "storeAddress",
      "billingPOSNo",
      "netPayableAmount",
      "orderNo",
      "cashierId",
      "cashierName",
      "orderDateTime",
    ],
    payments: ["mode", "total"],
    productsData: ["name", "productCode", "quantity", "unitAmount", "totalAmount"],
    billFooterData: ["footerInfo"],
  };

  // Validation function
  const isFormValid = () => {
    // Customer Info
    for (const field of mandatoryFields.customerInfo) {
      if (
        !formData.customerInfo[field] ||
        formData.customerInfo[field] === "" ||
        formData.customerInfo[field] === 0
      ) {
        return false;
      }
    }
    // Transaction Info
    for (const field of mandatoryFields.transactionInfo) {
      if (
        !formData.transactionInfo[field] ||
        formData.transactionInfo[field] === "" ||
        formData.transactionInfo[field] === 0
      ) {
        return false;
      }
    }
    // Order Details
    for (const field of mandatoryFields.orderDetails) {
      if (
        !formData.orderDetails[field] ||
        formData.orderDetails[field] === "" ||
        formData.orderDetails[field] === 0
      ) {
        return false;
      }
    }
    // Payments (at least one, all mandatory fields)
    if (
      !formData.orderDetails.payments ||
      formData.orderDetails.payments.length === 0
    ) {
      return false;
    }
    for (const payment of formData.orderDetails.payments) {
      for (const field of mandatoryFields.payments) {
        if (
          !payment[field] ||
          payment[field] === "" ||
          payment[field] === 0
        ) {
          return false;
        }
      }
    }
    // Products Data (at least one, all mandatory fields)
    if (
      !formData.orderDetails.productsData ||
      formData.orderDetails.productsData.length === 0
    ) {
      return false;
    }
    for (const product of formData.orderDetails.productsData) {
      for (const field of mandatoryFields.productsData) {
        if (
          !product[field] ||
          product[field] === "" ||
          product[field] === 0
        ) {
          return false;
        }
      }
    }
    // Bill Footer Data
    for (const field of mandatoryFields.billFooterData) {
      if (
        !formData.billFooterData[field] ||
        formData.billFooterData[field] === "" ||
        formData.billFooterData[field] === 0
      ) {
        return false;
      }
    }
    return true;
  };

  const handleChange = (e, section, key, index = null, nestedKey = null) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;

    setFormData((prev) => {
      // Handle taxes inside productsData
      if (nestedKey === "productsData.taxes" && index !== null) {
        const products = [...prev.orderDetails.productsData];
        const product = { ...products[index] };
        product.taxes = { ...product.taxes, [key]: value };
        products[index] = product;
        return {
          ...prev,
          orderDetails: {
            ...prev.orderDetails,
            productsData: products,
          },
        };
      }

      // Handle taxesInfo (order-level)
      if (nestedKey === "taxesInfo") {
        return {
          ...prev,
          orderDetails: {
            ...prev.orderDetails,
            taxesInfo: {
              ...prev.orderDetails.taxesInfo,
              [key]: value,
            },
          },
        };
      }

      if (nestedKey === "loyaltyData") {
        return {
          ...prev,
          orderDetails: {
            ...prev.orderDetails,
            loyaltyData: {
              ...prev.orderDetails.loyaltyData,
              [key]: value,
            },
          },
        };
      }

      // Handle other product fields
      if (nestedKey === "productsData" && index !== null) {
        const products = [...prev.orderDetails.productsData];
        products[index] = { ...products[index], [key]: value };
        return {
          ...prev,
          orderDetails: {
            ...prev.orderDetails,
            productsData: products,
          },
        };
      }

      // Default handler for top-level fields
      if (index !== null && nestedKey === "payments" && section === "orderDetails") {
        const payments = [...prev.orderDetails.payments];
        payments[index] = { ...payments[index], [key]: value };
        return {
          ...prev,
          orderDetails: {
            ...prev.orderDetails,
            payments,
          },
        };
      }

      if (index !== null && section === "productsData") {
        const products = [...prev.orderDetails.productsData];
        products[index] = { ...products[index], [key]: value };
        return {
          ...prev,
          orderDetails: {
            ...prev.orderDetails,
            productsData: products,
          },
        };
      }

      // Top-level fields
      if (section in prev) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [key]: value,
          },
        };
      }

      return prev;
    });
  };

  const handleAddProduct = () => {
    const newProduct = {
      name: "",
      description: "",
      productCode: "",
      quantity: 0,
      unitAmount: 0,
      totalAmount: 0,
      hsnCode: "",
      discount: 0,
      taxes: {
        sgstPercent: 0,
        sgst: 0,
        cgstPercent: 0,
        cgst: 0,
        igstPercent: 0,
        igst: 0,
        utgstPercent: 0,
        utgst: 0,
      },
    };
    setFormData((prev) => ({
      ...prev,
      orderDetails: {
        ...prev.orderDetails,
        productsData: [...prev.orderDetails.productsData, newProduct],
      },
    }));
  };

  const handleDeleteProduct = (index) => {
    setDeleteProductIndex(index); // Show confirmation prompt
  };

  const confirmDeleteProduct = () => {
    setFormData((prev) => {
      const updatedArray = [...prev.orderDetails.productsData];
      updatedArray.splice(deleteProductIndex, 1);
      return {
        ...prev,
        orderDetails: {
          ...prev.orderDetails,
          productsData: updatedArray,
        },
      };
    });
    setDeleteProductIndex(null); // Hide prompt after deletion
  };

  const cancelDeleteProduct = () => {
    setDeleteProductIndex(null); // Hide prompt without deleting
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setPopupType("error");
      setPopupMessage("Please fill all mandatory fields marked with *.");
      return;
    }
    setLoading(true); // Set loading to true when the API call starts

    // Clone the formData to avoid directly mutating the state
    const payload = JSON.parse(JSON.stringify(formData)); // Deep clone to avoid mutation

    // Helper function to recursively convert numeric fields to numbers
    const convertToNumbers = (obj) => {
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "string" && !isNaN(obj[key])) {
          obj[key] = Number(obj[key]); // Convert numeric strings to numbers
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          convertToNumbers(obj[key]); // Recursively handle nested objects
        }
      });
    };

    const convertToString = (value) => {
      if (value === null || value === undefined) {
        return ""; // Handle null or undefined values
      }
      return String(value); // Convert the value to a string
    };

    // Convert numeric fields in transactionInfo, orderDetails, and nested objects
    convertToNumbers(payload.transactionInfo);
    convertToNumbers(payload.orderDetails);
    convertToString(payload.invoiceNo);
    convertToString(payload.hsnCode);
    convertToString(payload.orderNo);
    convertToString(payload.orderRegNo);
    convertToString(payload.billingPOSNo);
    convertToString(payload.cashierId)
    convertToString(payload.storeCode)
    Object.keys(payload.transactionInfo).forEach((key) => {
      payload.transactionInfo[key] = convertToString(payload.transactionInfo[key]);
    });


    const apiUrl =
      "https://testapi.pinelabs.com/v1/billing-integration/qr-payments/transactions/digital-invoice-v2/create";

    // Construct the headers
    const headers = {
      Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJTYlBZU2ZJOS04bklWczl3Xy1Fa3RVdWNVaURNdUZiMGM5bkpVM3hhYzdBIn0.eyJleHAiOjE3NjE1NjMyMTksImlhdCI6MTc0NjAxMTIxOSwianRpIjoiMDdhZjZkMDYtZTM1ZC00ZjEwLWE2OTQtM2ZmMDFiNTMyMDYzIiwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eXRlc3QucGluZWxhYnMuY29tL3JlYWxtcy9waW5lbGFicyIsInN1YiI6IjhmNzJlZjBiLTI0ZTMtNDQwZi1iZmQzLTExMTVhMDhkZjBiZCIsInR5cCI6IkJlYXJlciIsImF6cCI6Ik1lcmNoYW50QmlsbGluZ1NlcnZfMjAxNSIsImFjciI6IjEiLCJzY29wZSI6ImZldGNoLnBpbmUub25lLnRyYW5zYWN0aW9uLkdFVCBiaWxsaW5nLWludGVncmF0aW9uLnFyLXBheW1lbnRzLnRyYW5zYWN0aW9ucy5QT1NUIHYxLmJpbGxpbmctaW50ZWdyYXRpb24ucXItcGF5bWVudHMudHJhbnNhY3Rpb25zLmRpZ2l0YWwtaW52b2ljZS12Mi5jcmVhdGUuUE9TVCBiaWxsaW5nLWludGVncmF0aW9uLnFyLXBheW1lbnRzLnRyYW5zYWN0aW9ucy5HRVQgYmlsbGluZy1pbnRlZ3JhdGlvbi5xci1wYXltZW50cy50cmFuc2FjdGlvbnMuY2FuY2VsLlBPU1Qgb2ZmbGluZV9hY2Nlc3MgdjEuYmlsbGluZy1pbnRlZ3JhdGlvbi5xci1wYXltZW50cy50cmFuc2FjdGlvbnMuZGlnaXRhbC1pbnZvaWNlLXYxLmNyZWF0ZS5QT1NUIiwiY2xpZW50SG9zdCI6IjExNS4xMTAuMTQxLjI0MiIsImV4dElkIjoiMjAxNSIsIk1lcmNoYW50SWQiOiIyMDE1IiwiY2xpZW50QWRkcmVzcyI6IjExNS4xMTAuMTQxLjI0MiIsImNsaWVudF9pZCI6Ik1lcmNoYW50QmlsbGluZ1NlcnZfMjAxNSJ9.h8fXECFyq81ADlaXotGBCEi9faW8Qo8eFzw4TXYiRIpdkef-cHTqOlcce7nqADJOTOu-2oU5c_RVIIGTNeiLYw",
      "Content-Type": "application/json",
      "correlation-id": "123455",
    };

    // Log the final curl command
    const curlCommand = `
curl --location '${apiUrl}' \\
--header 'Authorization: ${headers.Authorization}' \\
--header 'Content-Type: ${headers["Content-Type"]}' \\
--header 'correlation-id: ${headers["correlation-id"]}' \\
--data-raw '${JSON.stringify(payload, null, 2)}'
    `;
    console.log("Final CURL Command:\n", curlCommand);

    try {
      const response = await axios.post(apiUrl, payload, { headers });
      setPopupType("success");
      setPopupMessage("Invoice sent successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      setPopupType("error");
      setPopupMessage(error.response?.data?.message || "API call failed!");
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setLoading(false); // Set loading to false when the API call completes
    }
  };

  const renderFields = (section) => {
    if (section === "productsData") {
      return (
        <>
          {formData.orderDetails.productsData &&
            formData.orderDetails.productsData.map((product, index) => (
              <div key={index} className="product-block">
                <div className="product-fields">
                  {Object.keys(product).map((key) => {
                    if (key === "taxes") {
                      // Render Taxes block
                      return (
                        <div key={key} className="form-field">
                          <h5>Taxes</h5>
                          <div className="tax-info-block">
                            {product.taxes &&
                              Object.keys(product.taxes).map((taxKey) => (
                                <div key={taxKey} className="form-field">
                                  <label className="field-label">{formatFieldName(taxKey)}</label>
                                  <input
                                    type="number"
                                    value={product.taxes[taxKey] || 0} // Default to 0 if undefined
                                    onChange={(e) =>
                                      handleChange(e, "orderDetails", taxKey, index, "productsData.taxes")
                                    }
                                    className="field-input"
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      );
                    }
                    const isMandatory =
                      mandatoryFields.productsData.includes(key);
                    return (
                      <div key={key} className="form-field">
                        <label className="field-label">
                          {formatFieldName(key)}
                          {isMandatory && <span style={{ color: "red" }}> *</span>}
                        </label>
                        <input
                          type="text"
                          value={product[key] || ""} // Default to empty string if undefined
                          onChange={(e) =>
                            handleChange(e, "orderDetails", key, index, "productsData")
                          }
                          className="field-input"
                        />
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  className="delete-product-button"
                  onClick={() => handleDeleteProduct(index)}
                >
                  Delete
                </button>
                <hr className="product-separator" />
              </div>
            ))}
          <button
            type="button"
            className="add-product-button"
            onClick={handleAddProduct}
          >
            Add Product
          </button>
        </>
      );
    }

    if (section === "orderDetails") {
      return (
        <>
          <div className="form-field">
            <h5>Order Details</h5>
            <div className="order-details-block">
              {/* Render all fields in Order Details */}
              {Object.keys(formData[section]).map((key) => {
                if (
                  key === "productsData" ||
                  key === "payments" ||
                  key === "taxesInfo" ||
                  key === "loyaltyData"
                ) {
                  // Skip rendering these keys for now; we'll handle them later
                  return null;
                }
                if (key === "orderDateTime") {
                  // Render Order Date Time with a date-time picker including seconds
                  // Custom handler to keep format as "DD-MM-YYYY HH:mm:ss"
                  const formatDateTimeForInput = (value) => {
                    // Convert "13-09-2024 17:20:51" to "2024-09-13T17:20:51"
                    if (!value) return "";
                    const [date, time] = value.split(" ");
                    if (!date || !time) return "";
                    const [day, month, year] = date.split("-");
                    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${time}`;
                  };

                  const formatDateTimeForState = (value) => {
                    // Convert "2024-09-13T17:20:51" to "13-09-2024 17:20:51"
                    if (!value) return "";
                    const [date, time] = value.split("T");
                    if (!date || !time) return "";
                    const [year, month, day] = date.split("-");
                    return `${day}-${month}-${year} ${time}`;
                  };

                  return (
                    <div key={key} className="form-field">
                      <label className="field-label">{formatFieldName(key)}</label>
                      <input
                        type="datetime-local"
                        step="1"
                        value={formatDateTimeForInput(formData[section][key])}
                        onChange={(e) =>
                          handleChange(
                            { target: { value: formatDateTimeForState(e.target.value) } },
                            section,
                            key
                          )
                        }
                        className="field-input"
                      />
                    </div>
                  );
                }
                // Mark label with * if mandatory
                const isMandatory =
                  (mandatoryFields[section] && mandatoryFields[section].includes(key)) ||
                  false;

                return (
                  <div key={key} className="form-field">
                    <label className="field-label">
                      {formatFieldName(key)}
                      {isMandatory && <span style={{ color: "red" }}> *</span>}
                    </label>
                    <input
                      type="text"
                      value={formData[section][key]}
                      onChange={(e) => handleChange(e, section, key)}
                      className="field-input"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Render Payments Section */}
          {formData.orderDetails.payments && (
            <div className="form-field">
              <h5>Payments</h5>
              {formData.orderDetails.payments.map((payment, index) => (
                <div key={index} className="payment-block">
                  <div className="form-field">
                    <label className="field-label">
                      Mode<span style={{ color: "red" }}> *</span>
                    </label>
                    <select
                      value={payment.mode}
                      onChange={(e) =>
                        handleChange(e, "orderDetails", "mode", index, "payments")
                      }
                      className="field-input"
                    >
                      <option value="UPI">UPI</option>
                      <option value="CARD">CARD</option>
                      <option value="CASH">CASH</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="field-label">
                      Total<span style={{ color: "red" }}> *</span>
                    </label>
                    <input
                      type="number"
                      value={payment.total}
                      onChange={(e) =>
                        handleChange(e, "orderDetails", "total", index, "payments")
                      }
                      className="field-input"
                    />
                  </div>
                  <div className="form-field">
                    <label className="field-label">Status</label>
                    <input
                      type="text"
                      value={payment.status}
                      onChange={(e) =>
                        handleChange(e, "orderDetails", "status", index, "payments")
                      }
                      className="field-input"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Render Taxes Info Section */}
          {formData.orderDetails.taxesInfo && (
            <div className="form-field">
              <h5>Taxes Info</h5>
              <div className="tax-info-block">
                {Object.keys(formData.orderDetails.taxesInfo).map((taxKey) => (
                  <div key={taxKey} className="form-field">
                    <label className="field-label">{formatFieldName(taxKey)}</label>
                    <input
                      type="number" // Ensure numeric input
                      value={formData.orderDetails.taxesInfo[taxKey] || ""} // Ensure value is a number
                      onChange={(e) =>
                        handleChange(e, "orderDetails", taxKey, null, "taxesInfo")
                      }
                      className="field-input"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Render Loyalty Data Section */}
          {formData.orderDetails.loyaltyData && (
            <div className="form-field">
              <h5>Loyalty Data</h5>
              <div className="loyalty-data-block">
                {Object.keys(formData.orderDetails.loyaltyData).map((loyaltyKey) => (
                  <div key={loyaltyKey} className="form-field">
                    <label className="field-label">{formatFieldName(loyaltyKey)}</label>
                    <input
                      type="text"
                      value={formData.orderDetails.loyaltyData[loyaltyKey]}
                      onChange={(e) =>
                        handleChange(e, "orderDetails", loyaltyKey, null, "loyaltyData")
                      }
                      className="field-input"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      );
    }

    return Object.keys(formData[section]).map((key) => {
      // Add dropdown for txnType in transactionInfo
      if (section === "transactionInfo" && key === "txnType") {
        return (
          <div key={key} className="form-field">
            <label className="field-label">{formatFieldName(key)}</label>
            <select
              value={formData[section][key]}
              onChange={(e) => handleChange(e, section, key)}
              className="field-input"
            >
              <option value="UPI">UPI</option>
              <option value="CARD">CARD</option>
              <option value="CASH">CASH</option>
            </select>
          </div>
        );
      }
      // Mark label with * if mandatory
      const isMandatory =
        (mandatoryFields[section] && mandatoryFields[section].includes(key)) ||
        false;

      return (
        <div key={key} className="form-field">
          <label className="field-label">
            {formatFieldName(key)}
            {isMandatory && <span style={{ color: "red" }}> *</span>}
          </label>
          <input
            type="text"
            value={formData[section][key]}
            onChange={(e) => handleChange(e, section, key)}
            className="field-input"
          />
        </div>
      );
    });
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Digital Invoice Form</h1>
      <div className={`tabs ${popupMessage ? "popup-active" : ""}`}>
        <button
          className={`tab-button ${activeTab === "customerInfo" ? "active" : ""}`}
          onClick={() => setActiveTab("customerInfo")}
        >
          Customer Info
        </button>
        <button
          className={`tab-button ${activeTab === "transactionInfo" ? "active" : ""}`}
          onClick={() => setActiveTab("transactionInfo")}
        >
          Transaction Info
        </button>
        <button
          className={`tab-button ${activeTab === "orderDetails" ? "active" : ""}`}
          onClick={() => setActiveTab("orderDetails")}
        >
          Order Info
        </button>
        <button
          className={`tab-button ${activeTab === "productsData" ? "active" : ""}`}
          onClick={() => setActiveTab("productsData")}
        >
          Product Info
        </button>
        <button
          className={`tab-button ${activeTab === "billFooterData" ? "active" : ""}`}
          onClick={() => setActiveTab("billFooterData")}
        >
          Bill Footer Info
        </button>
      </div>
      <form onSubmit={handleSubmit} className={`form ${popupMessage ? "popup-active" : ""}`}>
        {activeTab === "customerInfo" && (
          <div className="form-section">{renderFields("customerInfo")}</div>
        )}
        {activeTab === "transactionInfo" && (
          <div className="form-section">{renderFields("transactionInfo")}</div>
        )}
        {activeTab === "orderDetails" && (
          <div className="form-section">{renderFields("orderDetails")}</div>
        )}
        {activeTab === "productsData" && (
          <div className="form-section">{renderFields("productsData")}</div>
        )}
        {activeTab === "billFooterData" && (
          <div className="form-section">{renderFields("billFooterData")}</div>
        )}
        <button
          type="submit"
          className="submit-button"
          disabled={!isFormValid()}
        >
          Submit
        </button>
      </form>
      {loading && (
  <div className="loading-toast">
    <div className="spinner"></div>
  </div>
)}
      {popupMessage && (
        <div className={`popup ${popupType}`}>
          <h3>{popupType === "success" ? "Success" : "Error"}</h3>
          <p>{popupMessage}</p>
          <button onClick={() => setPopupMessage(null)}>Close</button>
        </div>
      )}

      {/* Delete confirmation prompt */}
      {deleteProductIndex !== null && (
        <div className="popup">
          <h3>Delete Product</h3>
          <p>Do you want to delete this product?</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button onClick={confirmDeleteProduct}>Yes</button>
            <button onClick={cancelDeleteProduct}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DigitalInvoiceForm;