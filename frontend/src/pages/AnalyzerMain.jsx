import { useState } from "react";
import BASE_URL from "../../config";
import {
  Upload,
  BarChart,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function Analyzer() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setAnalysis(null);
    }
  };

  const performAnalysis = async () => {
    setAnalyzing(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(`${BASE_URL}/api/analyze-ui/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Something went wrong while analyzing.");
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto w-full bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-center mb-8">
          Upload your image to get started
        </h2>

        <div className="mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="UI Preview"
                  className="max-h-64 mx-auto object-contain"
                />
                <label className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                  <Upload size={16} className="mr-2" />
                  Change Image
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            ) : (
              <div>
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">
                  Drag and drop a UI image or
                </p>
                <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                  <Upload size={16} className="mr-2" />
                  Browse Files
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className={`flex items-center px-6 py-3 text-white rounded-md ${
              preview && !analyzing
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!preview || analyzing}
            onClick={performAnalysis}
          >
            <BarChart size={20} className="mr-2" />
            {analyzing ? "Analyzing..." : "Analyze UI"}
          </button>
        </div>
      </div>

      {analysis && (
        <div className="max-w-4xl mx-auto w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Analysis Results</h2>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Overall Score</h3>
              <span className="text-lg font-bold">
                {analysis.overallScore}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${
                  analysis.overallScore >= 80
                    ? "bg-green-500"
                    : analysis.overallScore >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${analysis.overallScore}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="flex items-center mb-4">
                <XCircle size={24} className="text-red-500 mr-2" />
                <h3 className="font-semibold text-red-800">
                  Areas for Improvement
                </h3>
              </div>
              <ul className="space-y-2">
                {analysis.improvements.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle
                      size={16}
                      className="text-red-500 mr-2 mt-1 flex-shrink-0"
                    />
                    <span className="text-red-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center mb-4">
                <CheckCircle size={24} className="text-green-500 mr-2" />
                <h3 className="font-semibold text-green-800">Strengths</h3>
              </div>
              <ul className="space-y-2">
                {analysis.strengths.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle
                      size={16}
                      className="text-green-500 mr-2 mt-1 flex-shrink-0"
                    />
                    <span className="text-green-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Detailed Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(analysis.metrics).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 capitalize mb-1">
                    {key}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">{value}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          value >= 80
                            ? "bg-green-500"
                            : value >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
