/*************************************************
 * LAGKLÄDER – BESTÄLLNINGSSYSTEM
 *************************************************/

const MOTTAGARE = "olle.ostlund@kareby.com";

// Antal kolumner som används per beställning
const BESTALLNING_KOLUMNER = 2;

// En tom kolumn mellan beställningarna
const MELLANRUM_KOLUMNER = 1;


/*************************************************
 * SKAPA / FÖRBERED GOOGLE SHEET
 *************************************************/

function setupSheet() {

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getActiveSheet();

  sheet.setName("Beställningar");

  // Första beställningen börjar i kolumn A
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 250);

  // Rubriker
  sheet.getRange("A1:B1")
    .merge()
    .setValue("LAGKLÄDER – BESTÄLLNINGAR")
    .setFontWeight("bold")
    .setFontSize(16)
    .setHorizontalAlignment("center");

  sheet.setFrozenRows(1);

  Logger.log("Sheet klart.");
}


/*************************************************
 * HÄMTA NÄSTA BESTÄLLNINGSNUMMER
 *************************************************/

function getNextOrderNumber(sheet) {

  const props =
    PropertiesService.getScriptProperties();

  let current =
    Number(
      props.getProperty("LAST_ORDER_NUMBER")
    );

  if (!current) {
    current = 1000;
  }

  current++;

  props.setProperty(
    "LAST_ORDER_NUMBER",
    current.toString()
  );

  return current;
}


/*************************************************
 * TA EMOT BESTÄLLNING FRÅN HEMSIDAN
 *************************************************/

function doPost(e) {

  try {

const data =
    JSON.parse(e.parameter.data);

    const sheet =
      SpreadsheetApp
        .getActiveSpreadsheet()
        .getSheetByName("Beställningar");

    if (!sheet) {
      throw new Error(
        "Sheetet 'Beställningar' finns inte."
      );
    }


    /**************************************
     * BESTÄLLNINGSNUMMER
     **************************************/

    const orderNumber =
      getNextOrderNumber(sheet);


    /**************************************
     * DATA
     **************************************/

    const email =
      data.email || "";

    const name =
      data.name || "";

    const team =
      data.team || "";

    const other =
      data.other || "";

    const items =
      data.items || [];


    /**************************************
     * BESTÄM KOLUMNER
     **************************************/

  const lastColumn = sheet.getLastColumn();

let startColumn = 1;

// Om det redan finns en beställning,
// börja efter den + en tom kolumn
if (lastColumn >= 2) {
    startColumn = lastColumn + MELLANRUM_KOLUMNER + 1;
}


    const labelColumn =
      startColumn;

    const valueColumn =
      startColumn + 1;


    /**************************************
     * SKAPA BESTÄLLNING
     **************************************/

    let row = 3;


    // Beställningsnummer

    sheet
      .getRange(
        row,
        startColumn,
        1,
        2
      )
      .merge()
      .setValue(
        "BESTÄLLNING #" + orderNumber
      )
      .setFontWeight("bold")
      .setFontSize(14)
      .setHorizontalAlignment("center")
      .setBackground("#111111")
      .setFontColor("#ffffff");


    row++;


    // Status

    sheet
      .getRange(
        row,
        labelColumn
      )
      .setValue("Status")
      .setFontWeight("bold");

    sheet
      .getRange(
        row,
        valueColumn
      )
      .setValue("Ny")
      .setFontWeight("bold");

    setupStatusDropdown(
      sheet,
      row,
      valueColumn
    );

    row++;


    // Datum

    sheet
      .getRange(
        row,
        labelColumn
      )
      .setValue("Datum")
      .setFontWeight("bold");

    sheet
      .getRange(
        row,
        valueColumn
      )
      .setValue(
        new Date()
      )
      .setNumberFormat(
        "yyyy-MM-dd HH:mm"
      );

    row++;


    // Namn

    addRow(
      sheet,
      row++,
      labelColumn,
      valueColumn,
      "Namn",
      name
    );


    // E-post

    addRow(
      sheet,
      row++,
      labelColumn,
      valueColumn,
      "E-post",
      email
    );


    // Lag

    addRow(
      sheet,
      row++,
      labelColumn,
      valueColumn,
      "Lag",
      team
    );


    /**************************************
     * PLAGG
     **************************************/

    row++;

    sheet
      .getRange(
        row,
        labelColumn
      )
      .setValue("PLAGG")
      .setFontWeight("bold");

    sheet
      .getRange(
        row,
        valueColumn
      )
      .setValue("STORLEK / NUMMER")
      .setFontWeight("bold");

    row++;


    items.forEach(item => {

      let product =
        item.product || "";

      let description = "";


      // Tröja

      if (item.number) {

        description =
          "Nr " +
          item.number +
          " – " +
          item.size;

      }

      // Shorts / strumpor

      else {

        description =
          item.quantity +
          " st – " +
          item.size;

      }


      addRow(
        sheet,
        row++,
        labelColumn,
        valueColumn,
        product,
        description
      );

    });


    /**************************************
     * ÖVRIGT
     **************************************/

    row++;

    addRow(
      sheet,
      row++,
      labelColumn,
      valueColumn,
      "Övrigt",
      other || "-"
    );


    /**************************************
     * FORMATERING
     **************************************/

    const endRow =
      row - 1;

    const range =
      sheet.getRange(
        3,
        startColumn,
        endRow - 2,
        2
      );

    range
      .setBorder(
        true,
        true,
        true,
        true,
        true,
        true
      )
      .setVerticalAlignment(
        "middle"
      );


    sheet
      .getRange(
        3,
        labelColumn,
        endRow - 2,
        1
      )
      .setFontWeight("bold");


    sheet.setColumnWidth(
      labelColumn,
      180
    );

    sheet.setColumnWidth(
      valueColumn,
      250
    );


    /**************************************
     * SKICKA E-POST
     **************************************/

    sendConfirmationEmail(
      orderNumber,
      email,
      name,
      team,
      items,
      other
    );


    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: true,
          orderNumber: orderNumber
        })
      )
      .setMimeType(
        ContentService.MimeType.JSON
      );


  } catch (error) {

    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: false,
          error: error.toString()
        })
      )
      .setMimeType(
        ContentService.MimeType.JSON
      );

  }

}


/*************************************************
 * LÄGG TILL RAD
 *************************************************/

function addRow(
  sheet,
  row,
  labelColumn,
  valueColumn,
  label,
  value
) {

  sheet
    .getRange(
      row,
      labelColumn
    )
    .setValue(label);

  sheet
    .getRange(
      row,
      valueColumn
    )
    .setValue(value);

}


/*************************************************
 * STATUS DROPDOWN
 *************************************************/

function setupStatusDropdown(
  sheet,
  row,
  column
) {

  const rule =
    SpreadsheetApp
      .newDataValidation()
      .requireValueInList(
        [
          "Ny",
          "Beställd",
          "Levererad",
          "Utlämnad",
          "Makulerad"
        ],
        true
      )
      .setAllowInvalid(false)
      .build();

  sheet
    .getRange(
      row,
      column
    )
    .setDataValidation(rule);

}


/*************************************************
 * SKICKA BEKRÄFTELSEMAIL
 *************************************************/

function sendConfirmationEmail(
  orderNumber,
  customerEmail,
  name,
  team,
  items,
  other
) {

  let rows = "";


  items.forEach(item => {

    let description;


    if (item.number) {

      description =
        "Nr " +
        item.number +
        " – " +
        item.size;

    } else {

      description =
        item.quantity +
        " st – " +
        item.size;

    }


    rows += `

      <tr>

        <td style="
          padding:8px;
          border-bottom:1px solid #ddd;
        ">
          ${escapeHtml(item.product)}
        </td>

        <td style="
          padding:8px;
          border-bottom:1px solid #ddd;
        ">
          ${escapeHtml(description)}
        </td>

      </tr>

    `;

  });


  const htmlBody = `

  <div style="
    font-family:Arial,sans-serif;
    max-width:700px;
    margin:auto;
  ">

    <h2>
      Bekräftelse på klädbeställning
    </h2>

    <p>
      Hej ${escapeHtml(name)}!
    </p>

    <p>
      Tack för din beställning.
    </p>

    <p>

      <strong>
        Beställning #${orderNumber}
      </strong>

      <br>

      Lag: ${escapeHtml(team)}

    </p>


    <table
      style="
        width:100%;
        border-collapse:collapse;
      "
    >

      <tr style="
        background:#111;
        color:white;
      ">

        <th style="
          padding:10px;
          text-align:left;
        ">
          Plagg
        </th>

        <th style="
          padding:10px;
          text-align:left;
        ">
          Storlek / nummer
        </th>

      </tr>

      ${rows}

    </table>


    <h3>
      Övrigt
    </h3>

    <p>
      ${escapeHtml(other || "-")}
    </p>


    <p>
      Med vänliga hälsningar<br>
      Lagkläder
    </p>

  </div>

  `;


  /**************************************
   * TILL BESTÄLLAREN
   **************************************/

  if (customerEmail) {

    MailApp.sendEmail({

      to: customerEmail,

      subject:
        "Bekräftelse på klädbeställning #" +
        orderNumber,

      htmlBody: htmlBody

    });

  }


  /**************************************
   * TILL MOTTAGAREN
   **************************************/

  MailApp.sendEmail({

    to: MOTTAGARE,

    subject:
      "NY KLÄDBESTÄLLNING #" +
      orderNumber +
      " – " +
      team,

    htmlBody: htmlBody

  });

}


/*************************************************
 * SKYDDA HTML
 *************************************************/

function escapeHtml(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}
