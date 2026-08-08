/**
 * QRIS Dinamis Core Library - Standalone
 * 
 * Bundled from qris-dinamis core logic.
 * Features: Parse, Validate, and Convert Static to Dynamic QRIS.
 */

// --- Types ---
/** A single TLV (Tag-Length-Value) element from a QRIS payload */
export interface TLV {
    tag: string;
    name: string;
    length: number;
    value: string;
    children?: TLV[];
}

/** Parsed QRIS data in a human-friendly structure */
export interface QRISData {
    version: string;
    method: "static" | "dynamic";
    merchantAccountInfo: MerchantAccountInfo[];
    merchantCategoryCode: string;
    currency: string;
    amount?: string;
    tipIndicator?: "prompt" | "fixed" | "percentage";
    tipFixed?: string;
    tipPercentage?: string;
    countryCode: string;
    merchantName: string;
    merchantCity: string;
    postalCode: string;
    additionalData?: TLV[];
    crc: string;
    raw: TLV[];
}

export interface MerchantAccountInfo {
    tag: string;
    globallyUniqueId: string;
    merchantId?: string;
    merchantCriteria?: string;
    fields: TLV[];
}

export interface ConvertOptions {
    amount: number;
    fee?: {
        type: "fixed" | "percentage";
        value: number;
    };
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

// --- CRC16 ---
/**
 * Calculate CRC16-CCITT checksum for QRIS/EMVCo QR codes.
 * Polynomial: 0x1021, Init: 0xFFFF
 */
export function calculateCRC16(str: string): string {
    let crc = 0xffff;

    for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = ((crc << 1) ^ 0x1021) & 0xffff;
            } else {
                crc = (crc << 1) & 0xffff;
            }
        }
    }

    return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

// --- Parser ---
/** Map of known EMVCo / QRIS tag IDs to human-readable names */
const TAG_NAMES: Record<string, string> = {
    "00": "Payload Format Indicator",
    "01": "Point of Initiation Method",
    "02": "Visa",
    "03": "Mastercard",
    "04": "Mastercard",
    "15": "Visa",
    "26": "Merchant Account Information",
    "27": "Merchant Account Information",
    "28": "Merchant Account Information",
    "29": "Merchant Account Information",
    "30": "Merchant Account Information",
    "31": "Merchant Account Information",
    "32": "Merchant Account Information",
    "33": "Merchant Account Information",
    "34": "Merchant Account Information",
    "35": "Merchant Account Information",
    "36": "Merchant Account Information",
    "37": "Merchant Account Information",
    "38": "Merchant Account Information",
    "39": "Merchant Account Information",
    "40": "Merchant Account Information",
    "41": "Merchant Account Information",
    "42": "Merchant Account Information",
    "43": "Merchant Account Information",
    "44": "Merchant Account Information",
    "45": "Merchant Account Information",
    "46": "Merchant Account Information",
    "47": "Merchant Account Information",
    "48": "Merchant Account Information",
    "49": "Merchant Account Information",
    "50": "Merchant Account Information",
    "51": "Merchant Account Information",
    "52": "Merchant Category Code",
    "53": "Transaction Currency",
    "54": "Transaction Amount",
    "55": "Tip or Convenience Indicator",
    "56": "Value of Convenience Fee (Fixed)",
    "57": "Value of Convenience Fee (%)",
    "58": "Country Code",
    "59": "Merchant Name",
    "60": "Merchant City",
    "61": "Postal Code",
    "62": "Additional Data Field",
    "63": "CRC",
};

/** Tags that contain nested TLV sub-elements */
const NESTED_TAGS = new Set([
    ...Array.from({ length: 26 }, (_, i) => String(i + 26).padStart(2, "0")),
    "62",
]);

/**
 * Parse a raw TLV string into an array of TLV elements.
 */
export function parseTLV(data: string): TLV[] {
    const elements: TLV[] = [];
    let pos = 0;

    while (pos < data.length) {
        if (pos + 4 > data.length) break;

        const tag = data.substring(pos, pos + 2);
        const length = parseInt(data.substring(pos + 2, pos + 4), 10);

        if (isNaN(length) || pos + 4 + length > data.length) break;

        const value = data.substring(pos + 4, pos + 4 + length);
        const name = TAG_NAMES[tag] ?? `Unknown (${tag})`;

        const element: TLV = { tag, name, length, value };

        if (NESTED_TAGS.has(tag)) {
            element.children = parseTLV(value);
        }

        elements.push(element);
        pos += 4 + length;
    }

    return elements;
}

/**
 * Parse a QRIS string into a structured QRISData object.
 */
export function parseQRIS(qrisString: string): QRISData {
    const raw = parseTLV(qrisString);

    const findTag = (tag: string) => raw.find((t) => t.tag === tag);

    const methodValue = findTag("01")?.value;
    const method = methodValue === "12" ? "dynamic" : "static";

    const tipIndicatorValue = findTag("55")?.value;
    let tipIndicator: QRISData["tipIndicator"];
    if (tipIndicatorValue === "01") tipIndicator = "prompt";
    else if (tipIndicatorValue === "02") tipIndicator = "fixed";
    else if (tipIndicatorValue === "03") tipIndicator = "percentage";

    // Extract merchant account information (tags 26-51)
    const merchantAccountInfo: MerchantAccountInfo[] = raw
        .filter((t) => {
            const tagNum = parseInt(t.tag, 10);
            return tagNum >= 26 && tagNum <= 51 && t.children;
        })
        .map((t) => {
            const children = t.children ?? [];
            const findChild = (childTag: string) =>
                children.find((c) => c.tag === childTag);

            return {
                tag: t.tag,
                globallyUniqueId: findChild("00")?.value ?? "",
                merchantId: findChild("01")?.value ?? findChild("02")?.value,
                merchantCriteria: findChild("03")?.value,
                fields: children,
            };
        });

    return {
        version: findTag("00")?.value ?? "01",
        method,
        merchantAccountInfo,
        merchantCategoryCode: findTag("52")?.value ?? "",
        currency: findTag("53")?.value ?? "360",
        amount: findTag("54")?.value,
        tipIndicator,
        tipFixed: findTag("56")?.value,
        tipPercentage: findTag("57")?.value,
        countryCode: findTag("58")?.value ?? "ID",
        merchantName: findTag("59")?.value ?? "",
        merchantCity: findTag("60")?.value ?? "",
        postalCode: findTag("61")?.value ?? "",
        additionalData: findTag("62")?.children,
        crc: findTag("63")?.value ?? "",
        raw,
    };
}

// --- Validator ---
/**
 * Validate a QRIS string for structural correctness.
 */
export function validateQRIS(qrisString: string): ValidationResult {
    const errors: string[] = [];

    if (!qrisString || qrisString.trim().length === 0) {
        return { valid: false, errors: ["QRIS string is empty"] };
    }

    const str = qrisString.trim();

    // Must start with payload format indicator "000201"
    if (!str.startsWith("000201")) {
        errors.push(
            'QRIS must start with Payload Format Indicator "000201"'
        );
    }

    // Minimum length check (header + CRC = at least 20 chars)
    if (str.length < 20) {
        errors.push("QRIS string is too short");
        return { valid: false, errors };
    }

    // CRC validation
    const dataWithoutCRC = str.substring(0, str.length - 4);
    const declaredCRC = str.substring(str.length - 4);
    const calculatedCRC = calculateCRC16(dataWithoutCRC);

    if (declaredCRC.toUpperCase() !== calculatedCRC) {
        errors.push(
            `CRC mismatch: expected ${calculatedCRC}, got ${declaredCRC.toUpperCase()}`
        );
    }

    // Try to parse TLV structure
    const elements = parseTLV(str);

    if (elements.length === 0) {
        errors.push("Failed to parse any TLV elements");
        return { valid: false, errors };
    }

    // Check required tags
    const tags = new Set(elements.map((e) => e.tag));

    const requiredTags = [
        { tag: "00", name: "Payload Format Indicator" },
        { tag: "01", name: "Point of Initiation Method" },
        { tag: "52", name: "Merchant Category Code" },
        { tag: "53", name: "Transaction Currency" },
        { tag: "58", name: "Country Code" },
        { tag: "59", name: "Merchant Name" },
        { tag: "60", name: "Merchant City" },
        { tag: "63", name: "CRC" },
    ];

    for (const req of requiredTags) {
        if (!tags.has(req.tag)) {
            errors.push(`Missing required tag ${req.tag} (${req.name})`);
        }
    }

    // Check Point of Initiation Method value
    const method = elements.find((e) => e.tag === "01");
    if (method && method.value !== "11" && method.value !== "12") {
        errors.push(
            `Invalid Point of Initiation Method: "${method.value}" (must be "11" or "12")`
        );
    }

    // Check at least one merchant account info exists (tags 26-51)
    const hasMerchant = elements.some((e) => {
        const n = parseInt(e.tag, 10);
        return n >= 26 && n <= 51;
    });
    if (!hasMerchant) {
        errors.push("No Merchant Account Information found (tags 26-51)");
    }

    return { valid: errors.length === 0, errors };
}

// --- Converter ---
/**
 * Rebuild a QRIS string from TLV elements (without CRC).
 */
function buildTLVString(elements: TLV[]): string {
    return elements
        .map((el) => {
            const value = el.children ? buildTLVString(el.children) : el.value;
            const length = value.length.toString().padStart(2, "0");
            return `${el.tag}${length}${value}`;
        })
        .join("");
}

/**
 * Create a TLV element.
 */
function makeTLV(tag: string, value: string, name = ""): TLV {
    return { tag, name, length: value.length, value };
}

/**
 * Convert a static QRIS string to dynamic by injecting amount and optional fee.
 *
 * Steps:
 * 1. Parse the TLV structure
 * 2. Change Point of Initiation Method from "11" (static) to "12" (dynamic)
 * 3. Insert/replace Transaction Amount (tag 54)
 * 4. Optionally insert Tip Indicator (tag 55) and fee value (tag 56/57)
 * 5. Recalculate CRC16 checksum
 */
export function convertQRIS(
    qrisString: string,
    options: ConvertOptions
): string {
    const elements = parseTLV(qrisString);

    // Build the new TLV array preserving order, injecting/replacing as needed
    const result: TLV[] = [];
    let amountInserted = false;

    // Tags to skip (we'll re-insert them)
    const managedTags = new Set(["54", "55", "56", "57", "63"]);

    for (const el of elements) {
        if (managedTags.has(el.tag)) continue;

        if (el.tag === "01") {
            // Change static → dynamic
            result.push(makeTLV("01", "12", "Point of Initiation Method"));
            continue;
        }

        // Insert amount + fee before tag 58 (Country Code)
        if (el.tag === "58" && !amountInserted) {
            const amountStr = options.amount.toString();
            result.push(makeTLV("54", amountStr, "Transaction Amount"));

            if (options.fee) {
                if (options.fee.type === "fixed") {
                    result.push(makeTLV("55", "02", "Tip or Convenience Indicator"));
                    result.push(
                        makeTLV(
                            "56",
                            options.fee.value.toString(),
                            "Value of Convenience Fee (Fixed)"
                        )
                    );
                } else {
                    result.push(makeTLV("55", "03", "Tip or Convenience Indicator"));
                    result.push(
                        makeTLV(
                            "57",
                            options.fee.value.toString(),
                            "Value of Convenience Fee (%)"
                        )
                    );
                }
            }

            amountInserted = true;
        }

        result.push(el);
    }

    // Build string without CRC, then append CRC
    const withoutCRC = buildTLVString(result);
    const crcInput = withoutCRC + "6304";
    const crc = calculateCRC16(crcInput);

    return crcInput + crc;
}
