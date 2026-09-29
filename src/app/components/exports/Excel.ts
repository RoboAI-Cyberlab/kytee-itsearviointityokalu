import ExcelJS from "exceljs";
import models from "@/data/models.json";
import type { Organization } from "@/store/organizationStore";
import type { FormValues } from "@/types/assessment";
import type { Domain } from "@/types/model";

import { getAnswerOptions } from "@/store/utils";
import { deriveAssessmentRows } from "./assessmentRows";
import { sanitizeExcelValue } from "./sanitize";

interface Choice {
  value: number;
  title: string;
}

// Add this helper function near the top of the file or with other helper functions
const protectImportSheet = (sheet: ExcelJS.Worksheet) => {
  sheet.protect("", {
    selectLockedCells: true,
    selectUnlockedCells: true,
    formatCells: false,
    formatColumns: false,
    formatRows: false,
    insertColumns: false,
    insertRows: false,
    insertHyperlinks: false,
    deleteColumns: false,
    deleteRows: false,
    sort: false,
    autoFilter: false,
    pivotTables: false,
  });

  sheet.properties.defaultRowHeight = 15;
  sheet.properties.defaultColWidth = 15;
  sheet.eachRow({ includeEmpty: false }, (row) => {
    row.eachCell((cell) => {
      cell.protection = {
        locked: true,
        hidden: false,
      };
    });
  });
};

export const downloadAssessmentAsXLSX = async (
  formValues: FormValues,
  organization: Organization,
  selectedModel: string,
  assessmentModel: Domain[],
): Promise<{ success: boolean; error?: string }> => {
  try {
    const rows = deriveAssessmentRows(formValues, assessmentModel);
    if (rows.length === 0) {
      return {
        success: false,
        error: "Ei löytynyt tuloksia lataamista varten.",
      };
    }

    const model = models.find((m) => m.id === selectedModel);
    if (!model) {
      return {
        success: false,
        error: "Ei löytynyt mallia.",
      };
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "RoboAI Cyberlab kyberturvallisuuden itsearviointi";
    workbook.created = new Date();

    const answerOptions = getAnswerOptions();

    try {
      // Detailed worksheet (original view)
      const detailedData = rows.map((row) => ({
        Osio: row.domainTitle,
        Käytäntö: row.practiceTitle,
        Tunniste: `${row.domainId}-${row.practiceId}`,
        Vastaus:
          answerOptions.find((c: Choice) => c.value === row.answer)?.title ||
          "Ei vastattu",
        Pisteet: row.answer || 0,
        Kehityskohde: row.flagged ? "Kyllä" : "Ei",
        Muistiinpano: sanitizeExcelValue(row.note || ""),
      }));

      // Import format worksheet
      const importData = rows.map((row) => ({
        Käytäntö: `${row.domainId}-${row.practiceId}`,
        Vastaus: row.answer || "",
        Muistiinpano: sanitizeExcelValue(row.note || ""),
      }));

      // Organization info worksheet data
      const organizationSheet = workbook.addWorksheet("Organisaatio");
      const organizationData = [
        ["Organisaatio", sanitizeExcelValue(organization.name || "")],
        ["Y-tunnus", sanitizeExcelValue(organization.business_id || "")],
        ["Toimiala", sanitizeExcelValue(organization.economic_area || "")],
        ["Toiminnan kuvaus", sanitizeExcelValue(organization.description || "")],
        ["Toiminnan yhteiskunnalliset vaikutukset", sanitizeExcelValue(organization.impact || "")],
        ["Yhteyshenkilön nimi", sanitizeExcelValue(organization.respondent || "")],
        ["Yhteyshenkilön sähköposti", sanitizeExcelValue(organization.respondent_email || "")],
        ["Yhteyshenkilön puhelinnumero", sanitizeExcelValue(organization.respondent_phone || "")],
        ["Muut osallistujat", sanitizeExcelValue(organization.participants || "")],
        ["Arvioinnin päivämäärät", sanitizeExcelValue(organization.dates || "")],
        ["Muistiinpanot", sanitizeExcelValue(organization.notes || "")],
        ["Arviointi tallennettu", new Date().toLocaleDateString("fi-FI")],
      ];

      // First add the rows
      organizationSheet.addRows(organizationData);

      // Then style the existing rows
      organizationData.forEach((_, index) => {
        const row = organizationSheet.getRow(index + 1);
        const firstCell = row.getCell(1);
        firstCell.font = { bold: true };
        firstCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF3F3F3" }, // Light gray color
        };
      });

      // Set first column width
      organizationSheet.getColumn(1).width = 35;

      // Add other worksheets
      const detailedSheet = workbook.addWorksheet("Itsearviointi");
      addJsonToSheet(detailedSheet, detailedData);

      // const summarySheet = workbook.addWorksheet("Yhteenveto");
      // addJsonToSheet(summarySheet, domainSummary);

      const importSheet = workbook.addWorksheet("Import Kybermittari");
      addJsonToSheet(importSheet, importData);
      protectImportSheet(importSheet);

      // Organization import format
      const organizationImportSheet = workbook.addWorksheet(
        "Import Organization",
      );
      const organizationImportData = [
        { key: "name", value: sanitizeExcelValue(organization.name || "") },
        { key: "business_id", value: sanitizeExcelValue(organization.business_id || "") },
        { key: "economic_area", value: sanitizeExcelValue(organization.economic_area || "") },
        { key: "description", value: sanitizeExcelValue(organization.description || "") },
        { key: "impact", value: sanitizeExcelValue(organization.impact || "") },
        { key: "respondent", value: sanitizeExcelValue(organization.respondent || "") },
        { key: "respondent_email", value: sanitizeExcelValue(organization.respondent_email || "") },
        { key: "respondent_phone", value: sanitizeExcelValue(organization.respondent_phone || "") },
        { key: "participants", value: sanitizeExcelValue(organization.participants || "") },
        { key: "dates", value: sanitizeExcelValue(organization.dates || "") },
        { key: "notes", value: sanitizeExcelValue(organization.notes || "") },
        { key: "saved_at", value: new Date().toLocaleDateString("fi-FI") },
      ];
      addJsonToSheet(organizationImportSheet, organizationImportData);
      protectImportSheet(organizationImportSheet);

      // Assessment import format
      const assessmentImportSheet = workbook.addWorksheet("Import Assessment");
      const assessmentImportData = rows.map((row) => ({
        key: `${row.domainId}-${row.practiceId}`,
        value: row.answer || 0,
        flagged: row.flagged ? "1" : "0",
        note: sanitizeExcelValue(row.note || ""),
      }));
      addJsonToSheet(assessmentImportSheet, assessmentImportData);
      protectImportSheet(assessmentImportSheet);

      // Model import format
      const modelImportSheet = workbook.addWorksheet("Import Model");
      const modelImportData = [
        { key: "id", value: model.id || "" },
        { key: "version", value: model.version || "" },
        { key: "description", value: model.description.fi || "" },
      ];
      addJsonToSheet(modelImportSheet, modelImportData);
      protectImportSheet(modelImportSheet);

      // Generate and download file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const date =
        new Date().toLocaleDateString("fi-FI") +
        "_" +
        new Date().toLocaleTimeString("fi-FI").replace(/:/g, "-");
      link.href = url;
      link.download = `itsearvioinnin_tulokset_${date}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      console.error("Excel tiedoston luomisessa tapahtui virhe:", err);
      return {
        success: false,
        error: "Excel tiedoston luomisessa tapahtui virhe. Yritä uudelleen.",
      };
    }
  } catch (err) {
    console.error("Odottamaton virhe Excel viennissä:", err);
    return {
      success: false,
      error: "Odottamaton virhe tiedoston luonnissa. Yritä uudelleen.",
    };
  }
};

// Helper function with error handling
const addJsonToSheet = (sheet: ExcelJS.Worksheet, data: Record<string, string | number | boolean>[]) => {
  try {
    if (data.length === 0) return;

    // Add headers
    const headers = Object.keys(data[0]);
    const headerRow = sheet.addRow(headers);

    // Style headers with bold text and light gray background
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF3F3F3" }, // Light gray color
    };

    // Add data
    data.forEach((item) => {
      const row = headers.map((header) => item[header]);
      sheet.addRow(row);
    });

    // Auto-fit columns
    sheet.columns.forEach((column) => {
      column.width = Math.max(
        15,
        Math.max(
          ...sheet
            .getColumn(column.number || 0)
            .values.filter((v: unknown) => v)
            .map((v: unknown) => String(v).length),
        ),
      );
    });
  } catch (err) {
    console.error(`Virhe välilehden '${sheet.name}' luonnissa:`, err);
    throw new Error(`Virhe välilehden '${sheet.name}' luonnissa.`);
  }
};
