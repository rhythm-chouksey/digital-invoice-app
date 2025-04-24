import React, { useState } from "react";
import axios from "axios";
import "./DigitalInvoiceForm.css";

function DigitalInvoiceForm() {
  const defaultFormData = {
    customerInfo: {
      mobile: "7906059714",
      name: "Aarav Rubral",
      email: "customer_6383575597@example.com",
      countryCode: "+91",
      gstrName: "Ramandeep",
      gstrMob: "9764775793",
      gstrNo: "217686439898",
    },
    transactionInfo: {
      clientId: "123454",
      batchId: "09865",
      roc: "876767",
      txnId: "97785",
      txnType: "UPI",
    },
    orderDetails: {
      storeCode: "9991",
      storeAddress: "Connaught Plaza Restaurants Pvt.Ltd.",
      billingPOSNo: "101",
      netPayableAmount: 13196,
      subTotal: 11782.12,
      rounding: 0,
      purchasedPieces: 3,
      invoiceNo: "5286",
      barCode: "barcode_data",
      cashierId: "475117",
      cashierName: "Krishna",
      orderDateTime: "13-09-2024 17:20:51",
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
        },
      ],
    },
    billFooterData: {
      disclaimer: "disclaimer testing",
      purchaseTerms: "https://company.co.in/",
      feedbackCode: "LTE123",
      feedbackDiscount: 0,
      feedbackLink: "https://company.co.in/",
      orderInstructions: "Please provide black Umbrella",
      footerInfo: "Thank you for shopping",
    },
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [activeTab, setActiveTab] = useState("customerInfo");

  // Utility function to format field names
  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };

  const handleChange = (e, section, key, index = null) => {
    const value = e.target.value;
    setFormData((prev) => {
      if (index !== null) {
        // Update nested array (e.g., productsData)
        const updatedArray = [...prev[section].productsData];
        updatedArray[index][key] = value;
        return {
          ...prev,
          [section]: {
            ...prev[section],
            productsData: updatedArray,
          },
        };
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      };
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
    setFormData((prev) => {
      const updatedArray = [...prev.orderDetails.productsData];
      updatedArray.splice(index, 1); // Remove the product at the given index
      return {
        ...prev,
        orderDetails: {
          ...prev.orderDetails,
          productsData: updatedArray,
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct the curl command
    const curlCommand = `
curl --location 'https://testapi.pinelabs.com/v1/billing-integration/qr-payments/transactions/digital-invoice-v2/create' \\
--header 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJTYlBZU2ZJOS04bklWczl3Xy1Fa3RVdWNVaURNdUZiMGM5bkpVM3hhYzdBIn0.DtG1R--rgd9HZccykXXeD7N13YCOStPTKsVMIDsDSn2VMHdBu7_Erwktt2YCm_k3tV5LMH4pwQYN6NAWGnDNlQ' \\
--header 'Content-Type: application/json' \\
--header 'correlation-id: 123455' \\
--data-raw '${JSON.stringify(formData, null, 2)}'
  `;

    console.log("Equivalent curl command:", curlCommand); // Log the curl command

    try {
      const response = await axios.post(
        "https://testapi.pinelabs.com/v1/billing-integration/qr-payments/transactions/digital-invoice-v2/create",
        formData,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJTYlBZU2ZJOS04bklWczl3Xy1Fa3RVdWNVaURNdUZiMGM5bkpVM3hhYzdBIn0.DtG1R--rgd9HZccykXXeD7N13YCOStPTKsVMIDsDSn2VMHdBu7_Erwktt2YCm_k3tV5LMH4pwQYN6NAWGnDNlQ",
            "Content-Type": "application/json",
            "correlation-id": "123455",
          },
        }
      );
      alert("API call successful!");
      console.log("Response:", response.data);
    } catch (error) {
      alert("API call failed!");
      console.error("Error:", error.response?.data || error.message);
    }
  };

  const renderFields = (section) => {
    if (section === "productsData") {
      return (
        <>
          {formData.orderDetails.productsData.map((product, index) => (
            <div key={index} className="product-block">
              <h3>Product {index + 1}</h3>
              <div className="product-fields">
                {Object.keys(product).map((key) => (
                  <div key={key} className="form-field">
                    <label className="field-label">{formatFieldName(key)}</label>
                    <input
                      type="text"
                      value={product[key]}
                      onChange={(e) => handleChange(e, "orderDetails", key, index)}
                      className="field-input"
                    />
                  </div>
                ))}
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
    return Object.keys(formData[section]).map((key) => (
      <div key={key} className="form-field">
        <label className="field-label">{formatFieldName(key)}</label>
        <input
          type="text"
          value={formData[section][key]}
          onChange={(e) => handleChange(e, section, key)}
          className="field-input"
        />
      </div>
    ));
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Digital Invoice Form</h1>
      <div className="tabs">
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
          Order Details
        </button>
        <button
          className={`tab-button ${activeTab === "productsData" ? "active" : ""}`}
          onClick={() => setActiveTab("productsData")}
        >
          Product Data
        </button>
        <button
          className={`tab-button ${activeTab === "billFooterData" ? "active" : ""}`}
          onClick={() => setActiveTab("billFooterData")}
        >
          Bill Footer Data
        </button>
      </div>
      <form onSubmit={handleSubmit} className="form">
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
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default DigitalInvoiceForm;