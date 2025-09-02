import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

const Demo1 = () => {
  const [formData, setFormData] = useState({
    AUART: "",
    VKORG: "",
    VTWEG: "",
    SPART: "",
    MATNR: "",
    ZMENG: "",
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    return Object.values(formData).every((value) => value.trim() !== "");
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiResponse = await fetch("http://localhost:5000/api/sapkey", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!apiResponse.ok) {
        throw new Error("Failed to fetch SAP key");
      }

      const data = await apiResponse.json();
      setResponse({
        formData: formData,
        sapKey: data.sapKey,
      });
      setShowDialog(true);
    } catch (err) {
      setError("Error calling API: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const questions = [
    { key: "AUART", label: "Sales Document Type", code: "AUART" },
    { key: "VKORG", label: "Sales Organization", code: "VKORG" },
    { key: "VTWEG", label: "Distribution Channel", code: "VTWEG" },
    { key: "SPART", label: "Division", code: "SPART" },
    { key: "MATNR", label: "Material", code: "MATNR" },
    { key: "ZMENG", label: "Order Quantity", code: "ZMENG" },
  ];

  return (
    <div className="h-full bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Credit Memo Data
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {questions.map((question) => (
            <div key={question.key} className="space-y-2">
              <label
                htmlFor={question.key}
                className="block text-sm font-medium text-gray-700"
              >
                {question.label} ({question.code}) *
              </label>
              <input
                type="text"
                id={question.key}
                name={question.key}
                value={formData[question.key]}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400"
                placeholder={`Enter ${question.label}`}
              />
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={loading || !isFormValid()}
            className="px-8 py-3 text-lg font-medium"
          >
            {loading ? "Generating VBELN..." : "Submit"}
          </Button>
        </div>

        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-green-800">
                SAP Data Submitted Successfully!
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-lg font-semibold text-green-800 mb-2">
                      Generated VBELN:{" "}
                      <span className="font-mono bg-white px-2 py-1 rounded border">
                        {response?.sapKey}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">
                      Submitted Data:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-50 p-3 rounded">
                        <span className="font-medium">
                          Sales Document Type (AUART):
                        </span>
                        <br />
                        <span className="text-gray-700">
                          {response?.formData.AUART}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <span className="font-medium">
                          Sales Organization (VKORG):
                        </span>
                        <br />
                        <span className="text-gray-700">
                          {response?.formData.VKORG}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <span className="font-medium">
                          Distribution Channel (VTWEG):
                        </span>
                        <br />
                        <span className="text-gray-700">
                          {response?.formData.VTWEG}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <span className="font-medium">Division (SPART):</span>
                        <br />
                        <span className="text-gray-700">
                          {response?.formData.SPART}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <span className="font-medium">Material (MATNR):</span>
                        <br />
                        <span className="text-gray-700">
                          {response?.formData.MATNR}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <span className="font-medium">
                          Order Quantity (ZMENG):
                        </span>
                        <br />
                        <span className="text-gray-700">
                          {response?.formData.ZMENG}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowDialog(false)}>
                Close
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Demo1;
