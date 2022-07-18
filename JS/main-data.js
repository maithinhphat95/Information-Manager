import { validName, checkInput } from "./common.js";
import { loginCheck, searchBoxInit } from "./search.js";
import { getUserList, checkLogin, logOutEvent } from "./home.js";
// Calculate the electricity bill for customer
// Try to write code by jQuery syntax

// Init the no# of customer
var stt = 1;
// Init customer list
let custList = [];
// Init the pageIndex
var pageIndex = 1;
// Init the records
let records = 5;
let maxPage;
// The editing element index
let editIndex = 0;

// Function calculate the letter
let calLetter = (x, y) => {
  return y - x;
};
// Constructor function of customer
let Customer = function (
  noData,
  nameData,
  addData,
  startData,
  endData,
  vatData,
  consumpData,
  amountData
) {
  this.noData = noData;
  this.nameData = nameData;
  this.addData = addData;
  this.startData = startData;
  this.endData = endData;
  this.vatData = vatData;
  this.consumpData = consumpData;
  this.amountData = amountData;
};
// Function calculate the amount
let calPrice = (x, y, tax) => {
  let lv1, lv2, lv3, sumAmount;
  let sum = y - x;
  const lv1price = 1480;
  const lv2price = 1500;
  const lv3price = 1800;
  lv3 = sum - 100;
  lv2 = sum - 50;
  lv1 = sum;
  if (sum > 100) {
    sumAmount = lv3 * lv3price + 50 * (lv2price + lv1price);
  } else if (sum > 50) {
    sumAmount = lv2 * lv2price + 50 * lv1price;
  } else {
    sumAmount = lv1 * lv1price;
  }
  return (sumAmount * (tax / 100 + 1)).toFixed(0);
};
// Function clear value
let clearData = (e) => {
  e.val("");
};
// Make the table form the array customer list
let getTable = (array) => {
  let myString = "";
  array.forEach((element) => {
    myString +=
      "<tr><td>" +
      element.noData +
      "</td> <td td > " +
      element.nameData +
      "</td><td>" +
      element.addData +
      "</td><td>" +
      element.startData +
      "</td><td>" +
      element.endData +
      "</td><td>" +
      element.vatData +
      "</td><td>" +
      element.consumpData +
      "</td><td>" +
      element.amountData +
      "</td><td>" +
      "<button title='Edit' name='edit' class='py-1 px-2 btn btn-primary mr-0 mr-lg-1' value='" +
      element.noData +
      "'><i class='fa-solid fa-pen-to-square'></i></button><button title='Delete' name='delete' class='py-1 px-2 btn btn-danger' value='" +
      element.noData +
      "'><i class='fa-solid fa-trash'></i></button>" +
      "</td></tr>";
  });
  return myString;
};
// Function get the page Index
let getPageIndex = (index) => {
  if (index == "previous") {
    if (pageIndex <= 1) {
      pageIndex = 1;
    } else pageIndex--;
    // pageIndex = pageIndex <= 1 ? 1 : pageIndex--;
  } else if (index == "next") {
    if (pageIndex >= maxPage) {
      pageIndex = maxPage;
    } else pageIndex++;
    // pageIndex = pageIndex >= 5 ? 5 : pageIndex++;
  } else {
    pageIndex = index;
  }
  showTable();
};
// function get page pagination
let getPagePagination = (array) => {
  maxPage =
    array.length % records == 0
      ? (maxPage = Math.floor(array.length / records))
      : Math.floor(array.length / records) + 1;
  let myString =
    "<li><button class='page-link page-item' aria-label='Previous' value='previous' )'><span aria-hidden='true'>&laquo;</span><span class='sr-only' >Previous</span></button></li>";
  for (var i = 1; i <= maxPage; i++) {
    myString +=
      "<li><button type='button' class='page-link page-item' value='" +
      i +
      "'>" +
      i +
      "</button></li>";
  }
  myString +=
    "<li><button class='page-link page-item' aria-label='Next' value='next')' ><span aria-hidden='true'>&raquo;</span><span class='sr-only'>Next</span></button></li>";
  return myString;
};
// Store local the array
let saveArray = (arr) => {
  // Conver object customer to JSON string and store at localStore
  localStorage.setItem(1, JSON.stringify(arr));
};
// Store customer to local
let storeLocal = (
  noData,
  nameData,
  addData,
  startData,
  endData,
  vatData,
  consumpData,
  amountData
) => {
  // Make an object for each customer
  let curCustomer = new Customer(
    noData,
    nameData,
    addData,
    startData,
    endData,
    vatData,
    consumpData,
    amountData
  );
  // Push new customer to customer list
  custList.push(curCustomer);
  saveArray(custList);
};
// Clear local storage
let clearLocal = () => {
  localStorage.clear();
};
// Clear the table
let clearTable = () => {
  $("table tbody").html(
    "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>"
  );
  custList = [];
  stt = 1;
};

// Function edit table
let editTable = () => {
  // Trigger edit button
  $("button[name='edit']").click((event) => {
    if (event.target.nodeName == "I") {
      editElement($(event.target).parent().val());
    } else {
      editElement($(event.target).val());
    }
  });
  // Trigger delete button
  $("button[name='delete']").click((event) => {
    if (event.target.nodeName == "I") {
      deleteElement($(event.target).parent().val());
    } else {
      deleteElement($(event.target).val());
    }
  });
  // Trigger the PagePagination
  $(".page-item").click((event) => {
    if (event.target.nodeName == "SPAN") {
      getPageIndex($(event.target).parent().val());
    } else {
      getPageIndex($(event.target).val());
    }
  });
};
// Function Get table from array
let showTable = () => {
  let myTable = $("tbody");
  let pagination = $(".pagination");
  // Check and get the customer list in the localStorage
  if (JSON.parse(localStorage.getItem(1))) {
    custList = JSON.parse(localStorage.getItem(1));
    stt = custList.length + 1;
    let currentTable = custList.slice(
      (pageIndex - 1) * records,
      pageIndex * records
    );
    // Show the page pagination
    pagination.html(getPagePagination(custList));
    // Show the table
    myTable.html(getTable(currentTable));
    // Trigger event for edit table buttons
    editTable();
  }
};
// validate Data function
let validData = (name, add, start, end) => {
  // Init the validate check variable
  let validStart,
    validEnd = false;
  // Valid personal data
  // Valid full name
  if (checkInput(name) || validName(name.val())) {
    name.next().text("Please input name with letters");
    return;
  } else name.next().text("");
  // Valid address
  if (checkInput(add)) {
    add.next().text("Please input address");
    return;
  } else add.next().text("");
  // Valid start data
  if (checkInput(start)) {
    start.next().text("Please input numer >0");
    validStart = false;
  } else {
    start.next().text("");
    validStart = true;
  }
  // valid end data
  if (checkInput(end)) {
    end.next().text("Please input numer >0");
    validEnd = false;
  } else if (end.val() - start.val() < 0) {
    end.next().text("Please input a number bigger than Start-up number");
    validEnd = false;
  } else {
    end.next().text("");
    validEnd = true;
  }
  return validStart && validEnd;
};
// Funciton when click cal-btn
let calculate = (e) => {
  // e.preventDefault();
  if (checkLevel() == 3) {
    // Selector the input box
    let fullName = $("#full-name");
    let address = $("#address");
    let startData = $("#start-data");
    let endData = $("#end-data");
    var tax = $("#vat-data");
    let numberLetter = $("#number-letter");
    let amountPay = $("#amount-pay");
    // Call calculate function
    if (!validData(fullName, address, startData, endData)) {
      clearData(numberLetter);
      clearData(amountPay);
      return;
    } else {
      numberLetter.val(calLetter(startData.val(), endData.val()));
      amountPay.val(calPrice(startData.val(), endData.val(), tax.val()));
      // Store the new customer to Array customer list
      storeLocal(
        stt,
        fullName.val(),
        address.val(),
        startData.val(),
        endData.val(),
        tax.val(),
        numberLetter.val(),
        amountPay.val()
      );
      showTable();
    }
  } else
    alert("You must be logged in with an admin account to use this function");
};
// --------------------------Edit the table------------------------
// Function check the login level
let checkLevel = () => {
  let level = JSON.parse(sessionStorage.getItem(2))
    ? JSON.parse(sessionStorage.getItem(2)).level
    : 0;
  return level;
};
// Function edit the element of table
let editElement = (number) => {
  if (checkLevel() == 3) {
    custList.forEach((element) => {
      if (element.noData == number) {
        $(".modal").fadeIn(0);
        $(".nameUpdate").val(element.nameData);
        $(".addUpdate").val(element.addData);
        $(".startUpdate").val(element.startData);
        $(".endUpdate").val(element.endData);
        $(".vatUpdate").val(element.vatData);
        editIndex = element.noData - 1;
        return;
      }
    });
  } else
    alert("You must be logged in with an admin account to use this function");
};
// Function confirm update the element
let updateElement = (name, add, start, end, vat, obj) => {
  if (validData(name, add, start, end)) {
    obj.nameData = name.val();
    obj.addData = add.val();
    obj.startData = start.val();
    obj.endData = end.val();
    obj.vatData = vat.val();
    $(".modal").fadeOut();
    alert(
      "Updating customer completed: No: " +
        obj.noData +
        " - Name: " +
        obj.nameData
    );
  }
};
// Update the custlist after remove element
let updateArr = (arr) => {
  $(arr).each((index, element) => {
    element.noData = index + 1;
  });
};
// Function delete the element of table
let deleteElement = (number) => {
  if (checkLevel() == 3) {
    if (confirm("Bạn có chắc chắn muốn xóa ?")) {
      custList.forEach((element) => {
        if (element.noData == number) {
          custList.splice(element.noData - 1, 1);
          updateArr(custList);
          saveArray(custList);
          showTable();
        }
      });
    }
  } else
    alert("You must be logged in with an admin account to use this function");
};

// Function when click update button
$("#update").click(() => {
  updateElement(
    $(".nameUpdate"),
    $(".addUpdate"),
    $(".startUpdate"),
    $(".endUpdate"),
    $(".vatUpdate"),
    custList[editIndex]
  );
  saveArray(custList);
  showTable();
});
// Function cancel update element
$("#cancel").click(() => {
  $(".modal").fadeOut();
});
// --------------------------Export the table------------------------
// Function export table to excel
let exportTableToExcel = () => {
  var dataType = "application/vnd.ms-excel";
  // Edit the file name
  let fileName = "Electric-Data.xls";
  let tableBody = getTable(custList);
  let tableStart =
    "<table><thead><tr><th>No</th><th>Name</th><th>Address</th><th>Start</th><th>End</th><th>VAT</th><th>Action</th></tr></thead><tbody>";
  let tableEnd = "</tbody></table>";
  let tableHTML = tableStart + tableBody + tableEnd;
  // Try to use Jquery
  let downloadLink = $(".link");
  // Create a link to the file
  downloadLink.attr("href", "data:" + dataType + ", " + tableHTML);
  // Setting the file name
  downloadLink.attr("download", fileName);
  // Triggering the function.
  downloadLink[0].click();
  // $(downloadLink[0]).trigger("click"); // to use .trigger() but the browser alert it isn't a function
};

// --------------------------Sort the table------------------------
let lastTh = "";
let sortAscending = false;
// Trigger sort the table
$("th").click((e) => {
  let key = "";
  let currentTh = "";
  let string = "";
  // Get the text of TH node
  if (e.target.nodeName == "I") {
    string = $(e.target).parent().text();
  } else {
    string = $(e.target).text();
  }
  if ($("th i")) {
    $("th i").remove();
  }
  // Identify the key
  key =
    string.search("No") >= 0
      ? "noData"
      : string.search("Name") >= 0
      ? "nameData"
      : string.search("Address") >= 0
      ? "addData"
      : string.search("Start") >= 0
      ? "startData"
      : string.search("End") >= 0
      ? "endData"
      : string.search("VAT") >= 0
      ? "vatData"
      : string.search("Consumption") >= 0
      ? "consumpData"
      : string.search("Amount") >= 0
      ? "amountData"
      : "";
  currentTh = key;
  // Check if click again at the TH node
  sortAscending = currentTh == lastTh ? !sortAscending : true;
  // Sort the table
  if (key == "nameData" || key == "addData") {
    custList.sort((a, b) => {
      // Check if sort while the some value is ascending
      if (a[key].toLowerCase() < b[key].toLowerCase()) {
        // Check if click is sortAscending or Desacending
        return sortAscending ? -1 : 1;
      }
      // Check if sort while the some value is ascending
      if (a[key].toLowerCase() > b[key].toLowerCase()) {
        // Check if click is sortAscending or Desacending
        return sortAscending ? 1 : -1;
      }
      return 0;
    });
    updateArr(custList);
  } else if (key != "noData") {
    custList.sort((a, b) => {
      if (parseInt(a[key]) < parseInt(b[key])) {
        return sortAscending ? -1 : 1;
      }
      if (parseInt(a[key]) > parseInt(b[key])) {
        return sortAscending ? 1 : -1;
      }
      return 0;
    });
    updateArr(custList);
  } else if (key == "noData") {
    custList.sort((a, b) => {
      if (parseInt(a[key]) < parseInt(b[key])) {
        return sortAscending ? -1 : 1;
      }
      if (parseInt(a[key]) > parseInt(b[key])) {
        return sortAscending ? 1 : -1;
      }
      return 0;
    });
  }
  lastTh = currentTh;
  saveArray(custList);
  showTable();

  if (sortAscending) {
    $(e.currentTarget).append(" <i class='fa fa-arrow-up' aria-hidden='true'>");
  } else
    $(e.currentTarget).append(
      " <i class='fa fa-arrow-down' aria-hidden='true'>"
    );
});
//---------------------------------------Trigger event------------------
// Event for click buttons
$("#calBtn").click(() => {
  if (loginCheck()) {
    calculate();
  } else {
    alert("Please login to use this application");
  }
});
// Get the number of record
$("#records").change(() => {
  records = $("#records").val();
  pageIndex = 1;
  showTable();
});
// Trigger download excel file
$(".download").click(() => {
  if (loginCheck()) {
    exportTableToExcel();
  } else {
    alert("Please login to use this application");
  }
});
// Load init data from storage
$(document).ready(() => {
  getUserList();
  checkLogin();
  showTable();
});
