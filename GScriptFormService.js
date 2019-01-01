/**
 * Google Scripts Form Service
 * Accept form submissions to google sheets, handle errors and so on.
 * To be added as a Google SCript from you google sheet db.
 */


/**
 * Sheet (Tab) Name.
 * Sheet1 is default name
 */
var sheetName = 'Sheet1'

/**
 * Get property store
 * all users can access within this script (only)
 * @see https://developers.google.com/apps-script/reference/properties/properties-service#getScriptProperties()
 */
var scriptProp = PropertiesService.getScriptProperties()


/**
 * Setup
 * Gets the active SpreadsheetApp ID adds to our PropertiesService
 * @see https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#getactivespreadsheet
 */
function setup () {
  var doc = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', doc.getId())
}

/**
 * doPost
 * Primary function to handle posting to our sheet.
 */
function doPost (e) {

  /**
   * Gets a lock to prevent user from running script concurrently
   * @see https://developers.google.com/apps-script/reference/lock/lock-service#getScriptLock()
   */
  var lock = LockService.getScriptLock()

  /**
   * Acquires lock with timeout
   * @see https://developers.google.com/apps-script/reference/lock/lock#waitLock
   */
  lock.waitLock(10000)

  try {

    /**
     * Open sheet by key id.
     * Key is obtained from url
     * @see https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#openbyidid
     */
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))


    /**
     * Get Sheet by name
     * @see https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet#getSheetByName
     */
    var sheet = doc.getSheetByName(sheetName)

    /**
     * Returns range of specified cells {Integer, Integer}
     * @see https://developers.google.com/apps-script/reference/spreadsheet/sheet#getRange
     * Then position of last column (that has content)
     * @see https://developers.google.com/apps-script/reference/spreadsheet/sheet#getlastcolumn
     * Then grid of values for range (2d array, by row then columns)
     * @see https://developers.google.com/apps-script/reference/spreadsheet/range#getValues()
     */
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]

    /**
     * Next Row
     * Gets last row plus 1
     */
    var nextRow = sheet.getLastRow() + 1

    /**
     * Map headers array to new array.
     * If 'timestamp' return new Date, else return value of matching url param.
     * @see https://developers.google.com/apps-script/guides/web
     */
    var newRow = headers.map(function(header) {
      return header === 'timestamp' ? new Date() : e.parameter[header]
    })

    /**
     * Get range from nextRow to endRow based on items in newRow
     * @see https://developers.google.com/apps-script/reference/spreadsheet/range#setValues
     */
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

    /**
     * return success as JSON
     * @see https://developers.google.com/apps-script/reference/content/content-service
     */
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  /**
   * Return error results as JSON
   * @see https://developers.google.com/apps-script/reference/content/content-service
   */
  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {

    /**
     * Release lock.
     * @see https://developers.google.com/apps-script/reference/lock/lock#releaseLock()
     */
    lock.releaseLock()
  }
}
