"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

import Button from "@/app/admin/dashboard/_components/Button";
import { importProducts } from "@/app/admin/dashboard/products/_actions/importProducts";

export default function ImportUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [importMode, setImportMode] = useState<
    "create" | "update" | "upsert"
  >("upsert");
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<{
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
} | null>(null);

const router = useRouter();

function handleFileChange(
  event: React.ChangeEvent<HTMLInputElement>
) {
  setResult(null);

  const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);

    if (!selectedFile) {
      setPreviewData([]);
      setErrors([]);
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;

      if (!data) return;

      const workbook = XLSX.read(data, {
        type: "array",
      });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const json =
        XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

      setPreviewData(json);

      const validationErrors: string[] = [];

      json.forEach((row, index) => {
        const sku = row["SKU"];
        const brand = row["Brand"];
        const category = row["Category"];
        const productName = row["Product Name"];

        if (!sku) {
          validationErrors.push(
            `Row ${index + 2}: SKU is required.`
          );
        }

        if (!brand) {
          validationErrors.push(
            `Row ${index + 2}: Brand is required.`
          );
        }

        if (!category) {
          validationErrors.push(
            `Row ${index + 2}: Category is required.`
          );
        }

        if (!productName) {
          validationErrors.push(
            `Row ${index + 2}: Product Name is required.`
          );
        }
      });

      setErrors(validationErrors);
    };

    reader.readAsArrayBuffer(selectedFile);
  }

  async function handleImport() {
    if (previewData.length === 0) return;

    if (errors.length > 0) {
      alert("Please fix all validation errors before importing.");
      return;
    }

    try {
      setIsImporting(true);

const rows = JSON.parse(JSON.stringify(previewData));

const importResult = await importProducts(
  rows,
  importMode
);

setResult(importResult);

// router.refresh();
    } catch (error) {
      console.error(error);
      setResult({
  created: 0,
  updated: 0,
  skipped: 0,
  errors: ["Import failed."],
});
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <div className="space-y-6">
<div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
  <h2 className="text-xl font-semibold">
    Drag & Drop Excel File
  </h2>

  <p className="mt-2 text-sm text-gray-500">
    or click below to download the template and choose a file.
  </p>

  <div className="mt-6 flex flex-wrap justify-center gap-3">
    <button
      type="button"
      onClick={() => {
        window.location.href =
          "/api/admin/products/template";
      }}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
    >
      Download Template
    </button>

    <input
      id="excel-file"
      type="file"
      accept=".xlsx"
      className="hidden"
      onChange={handleFileChange}
    />

    <Button
      type="button"
      onClick={() =>
        document.getElementById("excel-file")?.click()
      }
    >
      Choose Excel File
    </Button>
  </div>
</div>

      {file && (
        <div className="rounded-lg border bg-green-50 p-4">
          <p className="font-medium">
            Selected File
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {file.name}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            {(file.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}

      {previewData.length > 0 && (
        <div className="space-y-4 rounded-lg border p-4">
          <div>
            <h3 className="font-semibold">
              Preview
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              {previewData.length} rows detected. Showing first{" "}
              {Math.min(previewData.length, 10)} rows.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {Object.keys(previewData[0]).map((key) => (
                    <th
                      key={key}
                      className="whitespace-nowrap border px-3 py-2 text-left font-medium"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {previewData
                  .slice(0, 10)
                  .map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map(
                        (value, valueIndex) => (
                          <td
                            key={valueIndex}
                            className="whitespace-nowrap border px-3 py-2"
                          >
                            {String(value ?? "")}
                          </td>
                        )
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
          <h3 className="font-semibold text-red-700">
            Validation Errors
          </h3>

          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-600">
            {errors.map((error, index) => (
              <li key={index}>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-semibold">
          Import Mode
        </h3>

        <label className="flex items-start gap-3">
          <input
            type="radio"
            checked={importMode === "create"}
            onChange={() => setImportMode("create")}
          />

          <div>
            <p className="font-medium">
              Create New Only
            </p>

            <p className="text-sm text-gray-500">
              Skip products whose SKU already exists.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="radio"
            checked={importMode === "update"}
            onChange={() => setImportMode("update")}
          />

          <div>
            <p className="font-medium">
              Update Existing Only
            </p>

            <p className="text-sm text-gray-500">
              Update existing products and ignore new products.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="radio"
            checked={importMode === "upsert"}
            onChange={() => setImportMode("upsert")}
          />

          <div>
            <p className="font-medium">
              Create + Update (Recommended)
            </p>

            <p className="text-sm text-gray-500">
              Create new products and update existing products.
            </p>
          </div>
        </label>
</div>

{result && (
  <div className="rounded-lg border border-green-300 bg-green-50 p-4">
    <h3 className="font-semibold text-green-700">
      Import Result
    </h3>

    <div className="mt-3 space-y-1 text-sm">
      <p>
        <strong>Created:</strong> {result.created}
      </p>

      <p>
        <strong>Updated:</strong> {result.updated}
      </p>

      <p>
        <strong>Skipped:</strong> {result.skipped}
      </p>
    </div>

    {result.errors.length > 0 && (
      <div className="mt-4">
        <p className="font-medium text-red-600">
          Errors
        </p>

        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-600">
          {result.errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}

{previewData.length > 0 && errors.length === 0 && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleImport}
            disabled={isImporting}
          >
            {isImporting
              ? "Importing..."
              : "Import Products"}
          </Button>
        </div>
      )}
    </div>
  );
}