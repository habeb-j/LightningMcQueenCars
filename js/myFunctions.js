$(document).ready(function () {
  $(".show-details").change(function () {
    var id = $(this).val();
    var modelName = $(this).closest("tr").find("td").eq(1).text();

    if ($(this).is(":checked")) {
      var data = carDetails[id];
      var html =
        "<div id='detail-box-" +
        id +
        "' class='detail-text'>" +
        "<img src='images/" +
        modelName +
        ".png' alt='" +
        modelName +
        "' style='width: 150px; float: left; margin-left: 15px;' />" +
        "<strong>السيارة " +
        modelName +
        ":</strong> نوع الوقود: " +
        data.fuel +
        " | ناقل الحركة: " +
        data.transmission +
        " | عدد المقاعد: " +
        data.seatsNum +
        " | عداد الكيلومترات: " +
        data.Odometer +
        " | اللون: " +
        data.color +
        "<div style='clear: both;'></div></div>";
      $("#details-area").append(html);
    } else {
      $("#detail-box-" + id).remove();
    }
  });

  $(".select-car").change(function () {
    if ($(this).is(":checked")) {
      $(this).closest("tr").css("background-color", "#e0f7fa");
    } else {
      $(this).closest("tr").css("background-color", "white");
    }

    var selectedCars = $(".select-car:checked").length;
    $("#car-counter").text(selectedCars + " سيارة مختارة");

    if (selectedCars > 0) {
      $("#continueBtn").removeAttr("disabled");
    } else {
      $("#continueBtn").attr("disabled", "disabled");
      $("#form-area").html("");
    }
  });

  $("#continueBtn").click(function () {
    var selectedCars = $(".select-car:checked");

    if (selectedCars.length === 0) {
      alert("الرجاء اختيار سيارة واحدة على الأقل.");
      return;
    }
    //   الفورم و اعدادته
    var formHtml = `
            <form id="rentForm" action="" method="get">
                <fieldset>
                    <legend>معلومات مقدم الطلب</legend>
                    <label for="fullName">الاسم الكامل:</label>
                    <input type="text" id="fullName" name="fullName" placeholder="إلزامي - الرجاء إدخال أحرف عربية فقط" />
                    <label for="nationalID">الرقم الوطني:</label>
                    <input type="tel" id="nationalID" name="nationalID"  placeholder="إلزامي - تأكد أنك تدخل 11 خانة" oninput="this.value = this.value.replace(/[^0-9]/g, '')"/>
                    <label for="startDate">تاريخ بداية التأجير:</label>
                    <div style="overflow: hidden; margin-bottom: 10px;">
                        <input type="date" id="startDate" name="startDate" style="width: 80%; float: right;" />
                        <span style="color: red; float: left; line-height: 35px; font-weight: bold;">(إلزامي)</span>
                    </div>
                    <label for="endDate">تاريخ نهاية التأجير:</label>
                    <div style="overflow: hidden; margin-bottom: 10px;">
                        <input type="date" id="endDate" name="endDate" style="width: 80%; float: right;" />
                        <span style="color: red; float: left; line-height: 35px; font-weight: bold;">(إلزامي)</span>
                    </div>
                    <label for="mobile">رقم الموبايل(اختياري):</label>
                    <input type="tel" id="mobile" name="mobile" value="09" dir="ltr" style="text-align: right;" oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
                    <label for="email">البريد الإلكتروني (اختياري):</label>
                    <input type="text" id="email" name="email"  placeholder="اختياري"/>
                    <button type="submit" id="submitBtn">إرسال الطلب</button>
                </fieldset>
            </form>
        `;

    $("#form-area").html(formHtml);
    window.scrollTo(0, document.body.scrollHeight);

    $("#rentForm").submit(function (event) {
      event.preventDefault();

      var fullName = $("#fullName").val();
      var nationalID = $("#nationalID").val();
      var startDate = $("#startDate").val();
      var endDate = $("#endDate").val();
      var mobile = $("#mobile").val();
      var email = $("#email").val();
      //شروط الإدخالات في الفورم
      if (fullName === "") {
        alert("الرجاء إدخال الاسم الكامل.");
        return;
      }
      if (fullName.search(/^[\u0600-\u06FF\s]+$/) !== 0) {
        alert("الرجاء إدخال اسم صحيح (أحرف عربية فقط).");
        return;
      }
      if (
        nationalID.search(
          /^(01|02|03|04|05|06|07|08|09|10|11|12|13|14)\d{9}$/,
        ) !== 0
      ) {
        alert("الرجاء إدخال رقم وطني صحيح (11 خانة ويبدأ برمز المحافظة).");
        return;
      }
      if (
        startDate.search(/^\d{4}-\d{2}-\d{2}$/) !== 0 ||
        endDate.search(/^\d{4}-\d{2}-\d{2}$/) !== 0
      ) {
        alert("الرجاء إدخال التواريخ بالصيغة الصحيحة (yyyy-mm-dd).");
        return;
      }

      var start = new Date(startDate);
      var end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        alert("التواريخ المدخلة غير صالحة.");
        return;
      }
      if (end <= start) {
        alert("تاريخ النهاية يجب أن يكون لاحقاً لتاريخ البداية.");
        return;
      }

      if (
        mobile.length > 2 &&
        mobile.search(/^(093|094|095|096|098|099)\d{7}$/) !== 0
      ) {
        alert(
          "أنت حاولت إدخال رقم موبايل , الرجاء إدخال رقم موبايل صحيح أو اتركه فارغا.",
        );
        return;
      }
      if (email !== "" && email.search(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) !== 0) {
        alert("الرجاء إدخال بريد إلكتروني صحيح.");
        return;
      }

      var timeDiff = end.getTime() - start.getTime();
      var days = Math.ceil(timeDiff / (1000 * 3600 * 24));

      var totalCost = 0;
      var message = "السيارات المختارة:\n";

      $(".select-car:checked").each(function () {
        var model = $(this).attr("data-model");
        var price = parseFloat($(this).attr("data-price"));
        var carCost = days * price;
        totalCost += carCost;
        message +=
          "- " +
          model +
          " (عدد الأيام: " +
          days +
          ") - التكلفة: " +
          carCost +
          " ل.س\n";
      });

      if (days > 10) {
        totalCost = totalCost * 0.95;
        message += "\nتم تطبيق خصم 5% لتجاوز مدة التأجير 10 أيام.\n";
      }

      message += "\nالمبلغ الإجمالي: " + totalCost.toFixed(2) + " ل.س";

      alert(message);
      $("#form-area").html("");
      $("#details-area").html("");
      $(".select-car").prop("checked", false);
      $(".cars-table tbody tr").css("background-color", "white");
      $("#car-counter").text("0 سيارة مختارة");
      $("#continueBtn").attr("disabled", "disabled");
      window.scrollTo(0, 0);
    });
  });
});
// مصفوفة بالسيارات و مواصفاتها
var carDetails = {
  "CR-001": {
    fuel: "بنزين",
    transmission: "أوتوماتيك",
    seatsNum: 5,
    Odometer: 17883,
    color: "أبيض",
  },
  "CR-002": {
    fuel: "بنزين",
    transmission: "أوتوماتيك",
    seatsNum: 5,
    Odometer: 15590,
    color: "أسود",
  },
  "CR-003": {
    fuel: "بنزين",
    transmission: "أوتوماتيك",
    seatsNum: 5,
    Odometer: 12993,
    color: "فضي",
  },
  "CR-004": {
    fuel: "بنزين",
    transmission: "عادي",
    seatsNum: 4,
    Odometer: 30675,
    color: "أحمر",
  },
  "CR-005": {
    fuel: "بنزين",
    transmission: "أوتوماتيك",
    seatsNum: 5,
    Odometer: 50129,
    color: "رمادي",
  },
  "CR-006": {
    fuel: "بنزين",
    transmission: "أوتوماتيك",
    seatsNum: 5,
    Odometer: 29872,
    color: "أزرق",
  },
  "CR-007": {
    fuel: "بنزين",
    transmission: "أوتوماتيك",
    seatsNum: 5,
    Odometer: 11904,
    color: "أبيض",
  },
  "CR-008": {
    fuel: "بنزين",
    transmission: "أوتوماتيك",
    seatsNum: 5,
    Odometer: 43661,
    color: "أحمر",
  },
  "CR-009": {
    fuel: "بنزين",
    transmission: "أوتوماتيك",
    seatsNum: 7,
    Odometer: 25033,
    color: "أسود",
  },
  "CR-010": {
    fuel: "بنزين",
    transmission: "أوتوماتيك",
    seatsNum: 5,
    Odometer: 8766,
    color: "فضي",
  },
  "CR-011": {
    fuel: "بنزين",
    transmission: "أوتوماتيك",
    seatsNum: 5,
    Odometer: 49943,
    color: "رمادي",
  },
  "CR-012": {
    fuel: "بنزين",
    transmission: "أوتوماتيك",
    seatsNum: 7,
    Odometer: 15265,
    color: "أزرق",
  },
  "CR-013": {
    fuel: "بنزين",
    transmission: "أوتوماتيك",
    seatsNum: 5,
    Odometer: 63259,
    color: "أبيض",
  },
  "CR-014": {
    fuel: "بنزين",
    transmission: "أوتوماتيك",
    seatsNum: 5,
    Odometer: 12134,
    color: "أسود",
  },
  "CR-015": {
    fuel: "بنزين",
    transmission: "أوتوماتيك",
    seatsNum: 5,
    Odometer: 25441,
    color: "فضي",
  },
};
