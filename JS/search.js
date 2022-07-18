import { getUserList, checkLogin, logOutEvent } from "./home.js";
import { checkInput } from "./common.js";
// Init variable

// Function check login
export let loginCheck = () => {
  return JSON.parse(sessionStorage.getItem(2)) ? true : false;
};
// Function show search box
export let searchBoxInit = () => {
  if (!loginCheck()) {
    if ($(".search-box")) {
      $(".search-box").addClass("d-none");
    }
    alert("Please login to use this application");
    $(".go-back").show();
    return;
  } else {
    $(".go-back").hide();
    if ($(".search-box")) {
      $(".search-box").removeClass("d-none");
    }
  }
};
// ---------------------Search Event-----------------------
// Get the suggestion list
let getSuggestion = (string) => {
  if (string.trim()) {
    let userData = JSON.parse(localStorage.getItem(1));
    let pattern = new RegExp(string, "gim");
    $(".sugguestion-list").html("");
    $(".sugguestion-list").addClass("d-none");
    userData.forEach((element) => {
      if (element.nameData.search(pattern) >= 0) {
        $(".sugguestion-list").removeClass("d-none");
        // Create a suggestion item with jQuery and append to ul list
        var suggestionItem = $("<li></li>").text(element.nameData);
        $(".sugguestion-list").append(suggestionItem);
      }
    });
    $(".sugguestion-list")
      .children("li")
      .click((event) => {
        $("#search-name").val($(event.target).text());
        $(".sugguestion-list").addClass("d-none");
      });
  }
};
// Function show number with commas as thousands seperator
let showCommas = (number) => {
  // Tạo 1 array, mỗi số ứng với mỗi chữ trong array
  // Kiểm tra length của numberstring, xét vị trí của từng ký tự rồi thêm đơn vị vào
  // Dùng hàm thư viện VNnum2words:
  return (
    VNnum2words(number).charAt(0).toUpperCase() +
    VNnum2words(number).slice(1) +
    " đồng"
  );
};
// Function show bill
let showBill = (name, add, phone, start, end, vat, sum, amount) => {
  $(".bill-container").toggleClass("d-none");
  let lv3 = sum > 100 ? sum - 100 : 0;
  let lv1 = sum > 50 ? 50 : sum;
  let lv2 = sum - lv3 - lv1;
  let amountPay = [lv1 * 1480, lv2 * 1500, lv3 * 1800];
  let amountSum = amountPay[0] + amountPay[1] + amountPay[2];
  let price = [1480, 1500, 1800];
  let today = new Date();
  var dateString =
    today.getDate().toString() +
    "/" +
    (today.getMonth() + 1).toString() +
    "/" +
    today.getFullYear();
  $(".cust-name").text(name);
  $(".cust-address").text(add);
  $(".cust-phone").text(phone);
  $(".start-data").text(start.toLocaleString());
  $(".end-data").text(end.toLocaleString());
  $(".tax-rate").text(vat.toLocaleString());
  $(".consump-sum").text(sum.toLocaleString());
  $(".amount-sum").text(amountSum.toLocaleString());
  $(".consump-actual").text(sum.toLocaleString());
  $(".price-lv1").text(price[0].toLocaleString());
  $(".price-lv2").text(price[1].toLocaleString());
  $(".price-lv3").text(price[2].toLocaleString());
  $(".consump-lv1").text(lv1.toLocaleString());
  $(".consump-lv2").text(lv2.toLocaleString());
  $(".consump-lv3").text(lv3.toLocaleString());
  $(".amount-lv1").text(amountPay[0].toLocaleString());
  $(".amount-lv2").text(amountPay[1].toLocaleString());
  $(".amount-lv3").text(amountPay[2].toLocaleString());
  $(".amount-tax").text(((amountSum * vat) / 100).toLocaleString());
  $(".amount-total").text(parseInt(amount).toLocaleString());
  $(".sign-date").text(dateString);
  $(".amount-string").text(showCommas(amount));
};
// Function trigger the search button
let searchEvent = () => {
  let searchtObj = $("#search-name");
  // Prevent some one try to search while not login
  searchBoxInit();
  // Check the input string
  if (!checkInput(searchtObj)) {
    let userData = JSON.parse(localStorage.getItem(1));
    let customer = userData.find((e) => {
      return searchtObj.val() == e.nameData;
    });
    let userPhone = JSON.parse(sessionStorage.getItem(2)).phone;
    if (customer) {
      showBill(
        customer.nameData,
        customer.addData,
        userPhone,
        customer.startData,
        customer.endData,
        customer.vatData,
        customer.consumpData,
        customer.amountData
      );
    } else {
      alert(
        "There's no customer data with name: " +
          $("#search-name").val() +
          "\n" +
          "Please input correct fullname"
      );
      return;
    }
  } else {
    alert("Please input the name of customer");
  }
};
// ---------------------Active Event-----------------------
// Init the page onload

// Trigger the btn
$(".logOutBtn").click(function () {
  logOutEvent();
  $(".gethome")[0].click();
  // $(".gethome")[0].triger("click"); //Not active
});
$("#search-name").keyup(() => {
  getSuggestion($("#search-name").val());
});
$(".clearSearch").click(() => {
  $("#search-name").val("");
});

$(":not('#search-name')").click(() => {
  $(".sugguestion-list").addClass("d-none");
});
$(".search-btn").click(searchEvent);
$("button[value='close']").click(() => {
  $(".bill-container").addClass("d-none");
});
$(document).ready(() => {
  getUserList();
  checkLogin();
  searchBoxInit();
});
/*
//Try to print the bill to pdf
let doc = new jsPDF();
doc.text("Hello world!", 10, 10);
doc.save("a4.pdf");
*/
