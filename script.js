
//SEARCH depending on active tab

$("#searchInp").on("keyup", function () {
  var searchText = $(this).val(); 

  // Check which tab is currently active
  if ($("#departmentsBtn").hasClass("active")) {  
      
      $.ajax({
          url: "http://localhost/project2/dist/PHP/SearchAll.php",
          type: "GET",
          data: { txt: searchText, type: "department" },  
          dataType: "json",
          success: function (response) {
              if (response.status.code == "200") {
                  $("#departmentTableBody").empty(); 
                  let uniqueDepartments = new Set();

                  $.each(response.data.found, function (index, item) {
                    if (!uniqueDepartments.has(item.departmentName)) {  
                        uniqueDepartments.add(item.departmentName);
                      var rowHtml = "<tr>" +
                          "<td class='align-middle text-nowrap'>" + item.departmentName + "</td>" +  
                          "<td class='align-middle text-nowrap d-none d-md-table-cell'>" + item.locationName + "</td>" +
                          "<td class='text-end text-nowrap'>" +
                          "<button type='button' class='btn btn-primary btn-sm' data-bs-toggle='modal' data-bs-target='#editDepartmentModal' data-id='" + item.id + "'>" +
                          "<i class='fa-solid fa-pencil fa-fw'></i>" +
                          "</button> " +
                          "<button type='button' class='btn btn-primary btn-sm deleteDepartmentBtn' data-id='" + item.id + "'>" +
                          "<i class='fa-solid fa-trash fa-fw'></i>" +
                          "</button>" +
                          "</td>" +
                          "</tr>";

                      $("#departmentTableBody").append(rowHtml);
                    }
                  });

              } else {
                  $("#departmentTableBody").html("<tr><td colspan='3'>Error: " + response.status.description + "</td></tr>");
              }
          },
          error: function (xhr, status, error) {
              $("#departmentTableBody").html("<tr><td colspan='3'>AJAX Error: " + error + "</td></tr>");
          }
      });

  } else if ($("#personnelBtn").hasClass("active")) {
      // Search in Personnel
      $.ajax({
          url: "http://localhost/project2/dist/PHP/SearchAll.php",
          type: "GET",
          data: { txt: searchText, type: "personnel" },
          dataType: "json",
          success: function (response) {
              if (response.status.code == "200") {
                  $("#personnelTableBody").empty();

                  $.each(response.data.found, function (index, item) {
                      var rowHtml = "<tr>" +
                          "<td class='align-middle text-nowrap'>" + item.lastName + ", " + item.firstName + "</td>" +
                          "<td class='align-middle text-nowrap d-none d-md-table-cell'>" + item.jobTitle + "</td>" +
                          "<td class='align-middle text-nowrap d-none d-md-table-cell'>" + item.locationName + "</td>" +
                          "<td class='align-middle text-nowrap d-none d-md-table-cell'>" + item.email + "</td>" +
                          "<td class='align-middle text-nowrap d-none d-md-table-cell'>" + item.departmentName + "</td>" +
                          "<td class='text-end text-nowrap'>" +
                          "<button type='button' class='btn btn-primary btn-sm' data-bs-toggle='modal' data-bs-target='#editPersonnelModal' data-id='" + item.id + "'>" +
                          "<i class='fa-solid fa-pencil fa-fw'></i>" +
                          "</button> " +
                          "<button type='button' class='btn btn-primary btn-sm' data-bs-toggle='modal' data-bs-target='#deletePersonnelModal' data-id='" + item.id + "'>" +
                          "<i class='fa-solid fa-trash fa-fw'></i>" +
                          "</button>" +
                          "</td>" +
                          "</tr>";

                      $("#personnelTableBody").append(rowHtml);
                  });

              } else {
                  $("#personnelTableBody").html("<tr><td colspan='5'>Error: " + response.status.description + "</td></tr>");
              }
          },
          error: function (xhr, status, error) {
              $("#personnelTableBody").html("<tr><td colspan='5'>AJAX Error: " + error + "</td></tr>");
          }
      });
  } else if ($("#locationsBtn").hasClass("active")) {  
      // Search in Locations
      $.ajax({
          url: "http://localhost/project2/dist/PHP/SearchAll.php",
          type: "GET",
          data: { txt: searchText, type: "location" }, 
          dataType: "json",
          success: function (response) {
              if (response.status.code == "200") {
                  $("#locationTableBody").empty(); 

                  let uniqueLocations = new Set();

                  $.each(response.data.found, function (index, item) {
                    if (!uniqueLocations.has(item.locationName)) {  // Check if location is already added
                        uniqueLocations.add(item.locationName); 
                      var rowHtml = "<tr>" +
                          "<td class='align-middle text-nowrap'>" + item.locationName + "</td>" +  // Fix: Ensure this column exists in PHP
                          "<td class='text-end text-nowrap'>" +
                          "<button type='button' class='btn btn-primary btn-sm' data-bs-toggle='modal' data-bs-target='#editLocationModal' data-id='" + item.id + "'>" +
                          "<i class='fa-solid fa-pencil fa-fw'></i>" +
                          "</button> " +
                          "<button type='button' class='btn btn-primary btn-sm deleteLocationBtn' data-id='" + item.id + "'>" +
                          "<i class='fa-solid fa-trash fa-fw'></i>" +
                          "</button>" +
                          "</td>" +
                          "</tr>";

                      $("#locationTableBody").append(rowHtml);
                    }
                  })
                
              } else {
                  $("#locationTableBody").html("<tr><td colspan='3'>Error: " + response.status.description + "</td></tr>");
              }
          },
          error: function (xhr, status, error) {
              $("#locationTableBody").html("<tr><td colspan='3'>AJAX Error: " + error + "</td></tr>");
          }
      });
  }
});


// REFRESH Button 

$("#refreshBtn").click(function () {
  
  if ($("#personnelBtn").hasClass("active")) {
    
   
loadPersonnel();
    
  } else {
    
    if ($("#departmentsBtn").hasClass("active")) {
      
      
   loadDepartments();
      
    } else {
      
      if($("#locationsBtn").hasClass("active")){
         
      }
      
    loadLocations()
      
    }
    
  }
  
});

//FILTER button showing modal

$("#filterBtn").click(function () {
  if ($("#personnelBtn").hasClass("active")) {
    // Open the filter modal only if Personnel tab is active
    $("#filterPersonnelModal").modal("show");
  } else {
    console.log("Filter button is disabled for Departments and Locations.");
  }
});

//DISABLE Filter button for Department and Personnel tab

function updateFilterButton() {
  if ($("#personnelBtn").hasClass("active")) {
    $("#filterBtn").prop("disabled", false); // Enable when Personnel is active
  } else {
    $("#filterBtn").prop("disabled", true); // Disable for other tabs
  }
}

// Call function when switching tabs
$("#personnelBtn, #departmentsBtn, #locationsBtn").click(function () {
  updateFilterButton();
});

// Run on page load to set the correct state
$(document).ready(function () {
  updateFilterButton();
});



//FILTER Button Function

$("#filterPersonnelForm").submit(function (e) {
  e.preventDefault(); 

  var department = $("#filterPersonnelDepartment").val(); 
  var location = $("#filterPersonnelLocation").val(); 
  
  
  $.ajax({
    url: "http://localhost/project2/dist/PHP/SearchAll.php",
    type: 'GET',
    data: {
      txt: '' // Empty string to get all personnel
    },
    success: function (response) {
      

      let filteredResults = response.data.found;

      if (department || location) {
        filteredResults = filteredResults.filter(function(item) {
          var matchesDepartment;
          var matchesLocation;

          // Check if department is provided
          if (department) {
            matchesDepartment = item.departmentName.toLowerCase().indexOf(department.toLowerCase()) !== -1;
          } else {
            matchesDepartment = true;
          }

          // Check if location is provided
          if (location) {
            matchesLocation = item.locationName.toLowerCase().indexOf(location.toLowerCase()) !== -1;
          } else {
            matchesLocation = true;
          }

          // Return true if both match
          return matchesDepartment && matchesLocation;
        });
      }

      // Clear the table body
      $("#personnelTableBody").empty();

      // Check if filtered personnel data is not empty
      if (filteredResults.length > 0) {
        // Loop through the filtered results and create table rows
        $.each(filteredResults, function (index, item) {
          var rowHtml = "<tr>" +
            "<td class='align-middle text-nowrap'>" + item.lastName + ", " + item.firstName + "</td>" +
            "<td class='align-middle text-nowrap d-none d-md-table-cell'>" + item.jobTitle + "</td>" +
            "<td class='align-middle text-nowrap d-none d-md-table-cell'>" + item.locationName + "</td>" +
            "<td class='align-middle text-nowrap d-none d-md-table-cell'>" + item.email + "</td>" +
            "<td class='align-middle text-nowrap d-none d-md-table-cell'>" + item.departmentName + "</td>" +
            "<td class='text-end text-nowrap'>" +
            "<button type='button' class='btn btn-primary btn-sm' data-bs-toggle='modal' data-bs-target='#editPersonnelModal' data-id='" + item.id + "'>" +
            "<i class='fa-solid fa-pencil fa-fw'></i>" +
            "</button> " +
            "<button type='button' class='btn btn-primary btn-sm' data-bs-toggle='modal' data-bs-target='#deletePersonnelModal' data-id='" + item.id + "'>" +
            "<i class='fa-solid fa-trash fa-fw'></i>" +
            "</button>" +
            "</td>" +
            "</tr>";

          
          $("#personnelTableBody").append(rowHtml);
        });
      } else {
        
        $("#personnelTableBody").append('<tr><td colspan="5">No personnel found</td></tr>');
      }

      
      $("#filterPersonnelModal").modal('hide');
    },
    error: function (xhr, status, error) {
      console.error("Error: " + error);
    }
  });

});



  // ADD button showing respective modal

  $("#addBtn").click(function () {
    // Open the correct modal based on the active tab
    if ($("#personnelBtn").hasClass("active")) {
      // Open the add modal for personnel
      $("#addPersonnelModal").modal("show");
      loadDepartmentDropdown(); // Ensure department dropdown is loaded
  
    } else if ($("#departmentsBtn").hasClass("active")) {
      // Open the add modal for departments
      $("#addDepartmentModal").modal("show");
      loadLocationDropdown(); // Ensure location dropdown is loaded
  
    } else if ($("#locationsBtn").hasClass("active")) {
      // Open the add modal for locations (no dropdown needed)
      $("#addLocationModal").modal("show");
    }
  });
  
  // Initialize form submission functions (only once when the page loads)
  $(document).ready(function () {
    addPersonnel();
    addDepartment();
    addLocation();
  });

//





$(document).ready(function () {
  // Load dropdowns when opening modals
  $("#addDepartmentModal").on("show.bs.modal", function () {
    loadLocationDropdown();
  });

  $("#addPersonnelModal").on("show.bs.modal", function () {
    loadDepartmentDropdown();
  });

  // Initialize form submission functions (ensuring they are bound only once)
  addPersonnel();
  addDepartment();
  addLocation();
});

// Function to add Personnel
function addPersonnel() {
  $("#addPersonnelForm").on("submit", function (e) {
    e.preventDefault();

    var formData = {
      firstName: $("#addPersonnelFirstName").val(),
      lastName: $("#addPersonnelLastName").val(),
      jobTitle: $("#addPersonnelJobTitle").val(),
      email: $("#addPersonnelEmailAddress").val(),
      departmentID: $("#addPersonnelDepartment").val(),
    };

    console.log("Submitting personnel:", formData);

    $.ajax({
      url: "http://localhost/project2/dist/PHP/insertPersonnel.php",
      type: "POST",
      dataType: "json",
      data: formData,
      success: function (response) {
        console.log("AJAX Response:", response);

        if (response.status.code === "200") {
          console.log("Personnel added successfully!");
          $("#addPersonnelModal").modal("hide");

          // Refresh personnel table only
          setTimeout(() => {
            loadPersonnel();
          }, 500);
        } else {
          console.error("Error adding personnel:", response.status.message);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("AJAX error:", textStatus);
      }
    });
  });
}

//  Function to add Department
function addDepartment() {
  $("#addDepartmentForm").off("submit").on("submit", function (e) {
    e.preventDefault();

    var departmentName = $("#addDepartmentName").val().trim();
    var locationID = $("#addDepartmentLocation").val();

    // Prevent empty fields
    if (departmentName === "" || locationID === null) {
      alert("Please fill in all fields.");
      return;
    }

    var formData = {
      name: departmentName,
      locationID: locationID
    };

    console.log("Submitting department:", formData);

    $.ajax({
      url: "http://localhost/project2/dist/PHP/insertDepartment.php",
      type: "POST",
      dataType: "json",
      data: formData,
      success: function (response) {
        console.log("AJAX Response:", response);

        if (response.status.code === "200") {
          console.log("Department added successfully!");
          $("#addDepartmentModal").modal("hide");

          setTimeout(() => {
            loadDepartments();
            loadDepartmentDropdown();
          }, 500);
        } else {
          console.error("Error adding department:", response.status.message);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("AJAX error:", textStatus);
      }
    });
  });
}


// Function to add Location
function addLocation() {
  $("#addLocationForm").off("submit").on("submit", function (e) {
    e.preventDefault();

    var locationName = $("#addLocationName").val().trim();

    // Prevent submission if input is empty
    if (locationName === "") {
      alert("Please enter a location name.");
      $("#addLocationName").focus();
      return;
    }

    var formData = { name: locationName };

    console.log("Submitting location:", formData);

    $.ajax({
      url: "http://localhost/project2/dist/PHP/insertLocation.php",
      type: "POST",
      dataType: "json",
      data: formData,
      success: function (response) {
        console.log("AJAX Response:", response);

        if (response.status.code === "200") {
          console.log("Location added successfully!");

          // Hide the modal correctly
          $("#addLocationModal").modal("hide");

          // Refresh location table only once
          setTimeout(() => {
            loadLocations();
          }, 500);
        } else {
          console.error("Error adding location:", response.status.message);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("AJAX error:", textStatus);
      }
    });
  });
}







//  Function to load Locations in Department Dropdown
function loadLocationDropdown() {
  $.ajax({
    url: "http://localhost/project2/dist/PHP/getAllLocations.php",
    type: "GET",
    dataType: "json",
    success: function (response) {
      if (response.status.code === "200") {
        var locationDropdown = $("#addDepartmentLocation");
        locationDropdown.empty();
        locationDropdown.append('<option selected disabled>Select a Location</option>');

        $.each(response.data, function (index, location) {
          locationDropdown.append(
            `<option value="${location.id}">${location.name}</option>`
          );
        });

        console.log("Locations dropdown updated.");
      } else {
        console.error("Error loading locations: " + response.status.message);
      }
    },
    error: function () {
      console.error("Error fetching locations.");
    }
  });
}

//  Function to load Departments in Personnel Dropdown
function loadDepartmentDropdown() {
  $.ajax({
    url: "http://localhost/project2/dist/PHP/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (response) {
      if (response.status.code === "200") {
        var departmentDropdown = $("#addPersonnelDepartment");
        departmentDropdown.empty();
        departmentDropdown.append('<option selected disabled>Select a Department</option>');

        $.each(response.data, function (index, department) {
          departmentDropdown.append(
            `<option value="${department.id}">${department.department}</option>`
          );
        });

        console.log("Departments dropdown updated.");
      } else {
        console.error("Error loading departments: " + response.status.message);
      }
    },
    error: function () {
      console.error("Error fetching departments.");
    }
  });
}




//////////////////////////

//LOAD Personnel

function loadPersonnel() {
  
  // Call function to refresh personnel table

  $.ajax({

    url: "http://localhost/project2/dist/PHP/SearchAll.php",
    type: "GET",
    data: { txt: "" },
    dataType: "json",
    success: function (response) {

      console.log("AJAX Response:", response);

      if(response.status.code ==="200") {
        $("#personnelTableBody").empty();

        $.each(response.data.found, function(index, item) {
          let rowHtml = `<tr>
              <td class="align-middle text-nowrap">${item.lastName}, ${item.firstName}</td>
              <td class="align-middle text-nowrap d-none d-lg-table-cell">${item.jobTitle}</td>
              <td class="align-middle text-nowrap d-none d-lg-table-cell">${item.locationName}</td>
              <td class="align-middle text-nowrap d-none d-lg-table-cell">${item.email}</td>
              <td class="align-middle text-nowrap d-none d-lg-table-cell">${item.departmentName}</td>
              <td class="text-end text-nowrap">
                  <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${item.id}">
                      <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button type="button" class="btn btn-danger btn-sm deletePersonnelBtn" data-id="${item.id}">
                      <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
              </td>
          </tr>`;
      
          $("#personnelTableBody").append(rowHtml);
      });
      
      
            } else {
                $("#personnelTableBody").html("<tr><td colspan='5'>Error: " + response.status.description + "</td></tr>");
            }
        },
        error: function (xhr, status, error) {
            $("#personnelTableBody").html("<tr><td colspan='5'>AJAX Error: " + error + "</td></tr>");
        }
    });
  };

  $(document).ready(function () {
    loadPersonnel(); // Load personnel on page load
  });
  
  // Reload personnel when the locations button is clicked
  $("#personnelBtn").click(function () {
    loadPersonnel(); // Reuse the same function
  });






//LOAD Department 


function loadDepartments() {
 
  
  $.ajax({
      url: "http://localhost/project2/dist/PHP/getAllDepartments.php",
      type: "GET",
      dataType: "json",
      success: function (response) {
          if (response.status.code === "200") {
              $("#departmentTableBody").empty();

              $.each(response.data, function (index, item) {
                let rowHtml = `<tr>
                    <td class="align-middle text-nowrap">${item.department}</td>
                    <td class="align-middle text-nowrap">${item.locationName}</td>
                    <td class="text-end text-nowrap">
                        <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${item.id}">
                            <i class="fa-solid fa-pencil fa-fw"></i>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm deleteDepartmentBtn" data-id="${item.id}">
                            <i class="fa-solid fa-trash fa-fw"></i>
                        </button>
                    </td>
                </tr>`;
                
                $("#departmentTableBody").append(rowHtml);
            });
            
              console.log("Department Table Updated!");
          } else {
              $("#departmentTableBody").html("<tr><td colspan='5'>Error: " + response.status.description + "</td></tr>");
          }
      },
      error: function (xhr, status, error) {
          console.error("AJAX Error:", error);
      }
  });
}

// Run department load function when the tab is clicked & on page load
$(document).ready(function () {
  loadDepartments();
});
$("#departmentsBtn").click(function () {
  loadDepartments();
});





//LOAD LOCATIONS

function loadLocations() {
  console.log("Refreshing Location Table...");

  $.ajax({
      url: "http://localhost/project2/dist/PHP/getAllLocations.php",
      type: "GET",
      dataType: "json",
      cache: false, // Prevent cached responses
      success: function (response) {
          console.log("Received Response:", response); // Debugging log

          if (response.status.code === "200") {
              $("#locationTableBody").empty(); // Clear old table data

              if (response.data.length === 0) {
                  console.log("No locations found!");
                  $("#locationTableBody").html("<tr><td colspan='2'>No locations available</td></tr>");
                  return;
              }

              // Loop through location data and add rows
              $.each(response.data, function (index, item) {
                  const rowHtml = `<tr>
                      <td class='align-middle text-nowrap'>${item.name}</td>
                      <td class='text-end text-nowrap'>
                          <button type='button' class='btn btn-primary btn-sm' data-bs-toggle='modal' data-bs-target='#editLocationModal' data-id='${item.id}'>
                              <i class='fa-solid fa-pencil fa-fw'></i>
                          </button>
                          <button type='button' class='btn btn-danger btn-sm deleteLocationBtn' data-id='${item.id}'>
                              <i class='fa-solid fa-trash fa-fw'></i>
                          </button>
                      </td>
                  </tr>`;

                  $("#locationTableBody").append(rowHtml);
              });

              console.log("Location Table Updated!");
          } else {
              console.error("Error loading locations:", response.status.description);
              $("#locationTableBody").html("<tr><td colspan='2'>Error loading locations</td></tr>");
          }
      },
      error: function (xhr, status, error) {
          console.error("AJAX Error:", error);
          $("#locationTableBody").html("<tr><td colspan='2'>AJAX Error: " + error + "</td></tr>");
      }
  });
}

// Ensure the function loads when page loads
$(document).ready(function () {
  loadLocations();
});

// Ensure function loads when clicking the locations tab
$("#locationsBtn").click(function () {
  loadLocations();
});



  //Editing Personnel  modal

$("#editPersonnelModal").on("show.bs.modal", function (e) {
  
  var recordId = $(e.relatedTarget).data("id");
  console.log("Record ID from button:", recordId);

  $.ajax({
    url:
      "http://localhost/project2/dist/PHP/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      // Retrieve the data-id attribute from the calling button
      // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
      // for the non-jQuery JavaScript alternative
      id: recordId 
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);

        $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
        $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
        // $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
        $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);

        $("#editPersonnelDepartment").html("");

        $.each(result.data.department, function () {
          $("#editPersonnelDepartment").append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );
        });

        $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
        
      } else {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });
});

// SAVES the edits from Personnel edit modal 

$("#editPersonnelForm").on("submit", function (e) {
  e.preventDefault();

  var formData = $(this).serialize();

  $.ajax({
      url: "http://localhost/project2/dist/PHP/updatePersonnel.php",
      type: "POST",
      dataType: "json",
      data: formData,
      success: function (response) {
          if (response.status.code === "200") {
              console.log("Personnel updated successfully!");

              // Close modal
              $("#editPersonnelModal").modal("hide");

              // Refresh personnel table after modal closes
              setTimeout(() => {
                  loadPersonnel();
              }, 500);
          } else {
              alert("Error updating record: " + response.status.message);
          }
      },
      error: function (jqXHR, textStatus, errorThrown) {
          alert("AJAX error: " + textStatus);
      }
  });
});

  


// EDIT Department modal

// When the editDepartmentModal is about to be shown...
$("#editDepartmentModal").on("show.bs.modal", function (e) {
  const departmentId = $(e.relatedTarget).data("id");
  console.log("Department ID:", departmentId);

  // First, load the department data for editing.
  $.ajax({
      url: "http://localhost/project2/dist/PHP/getDepartmentDetails.php",
      type: "GET", // or "POST" if you prefer
      dataType: "json",
      data: { id: departmentId },
      success: function (response) {
          if (response.status.code === "200" && response.data.length > 0) {
              const department = response.data[0];

              // Set the department name and hidden ID
              $("#editDepartmentName").val(department.name);
              $("#editDepartmentID").val(department.id);

              // Now load all locations for the drop-down.
              $.ajax({
                  url: "http://localhost/project2/dist/PHP/getAllLocations.php",
                  type: "GET",
                  dataType: "json",
                  success: function (locResponse) {
                      if (locResponse.status.code === "200") {
                          // Clear existing options
                          $("#editDepartmentLocation").empty();

                          // Populate the drop-down with location options
                          $.each(locResponse.data, function (index, location) {
                              $("#editDepartmentLocation").append(
                                  $("<option>", {
                                      value: location.id,
                                      text: location.name
                                  })
                              );
                          });

                          // Set the current location from the department data
                          $("#editDepartmentLocation").val(department.locationID);
                      } else {
                          $("#editDepartmentModal .modal-title").text("Error loading locations");
                      }
                  },
                  error: function () {
                      $("#editDepartmentModal .modal-title").text("Error retrieving locations");
                  }
              });
          } else {
              $("#editDepartmentModal .modal-title").text("Department not found");
          }
      },
      error: function () {
          $("#editDepartmentModal .modal-title").text("Error retrieving department data");
      }
  });
});

//SAVING edits in Department modal

$("#editDepartmentForm").on("submit", function (e) {
  e.preventDefault();

  var formData2 = $(this).serialize();

  $.ajax({
      url: "http://localhost/project2/dist/PHP/updateDepartments.php",
      type: "POST",
      dataType: "json",
      data: formData2,
      success: function (response) {
          if (response.status.code === "200") {
              console.log("Department updated successfully!");

              // Close modal
              $("#editDepartmentModal").modal("hide");

              // Wait for modal to close, then refresh department table
              setTimeout(() => {
                  loadDepartments();
              }, 500);
          } else {
              alert("Error updating record: " + response.status.message);
          }
      },
      error: function (jqXHR, textStatus, errorThrown) {
          alert("AJAX error: " + textStatus);
      }
  });
});



//EDIT LOCATION Modal

// When the edit location modal is about to be shown...
$("#editLocationModal").on("show.bs.modal", function (e) {
  var locationID = $(e.relatedTarget).data("id"); // The id of the location to edit
  console.log("Location ID:", locationID);

  $.ajax({
    url: "http://localhost/project2/dist/PHP/getLocationByID.php",
    type: "GET", // or POST, depending on your design
    dataType: "json",
    data: { id: locationID },
    success: function (response) {
      if (response.status.code === "200") {
        // For example, fill your modal fields with the location data:
        $("#editLocationID").val(response.data.id); // Hidden input for id
        $("#editLocationName").val(response.data.name);
      } else {
        $("#editLocationModal .modal-title").text("Error retrieving location data");
      }
    },
    error: function () {
      $("#editLocationModal .modal-title").text("Error retrieving location data");
    }
  });
});

//SAVING edits in Location modal

$("#editLocationForm").on("submit", function (e) {
  e.preventDefault(); // Prevent default form submission

  var formData3 = $(this).serialize();

  $.ajax({
      url: "http://localhost/project2/dist/PHP/updateLocation.php",
      type: "POST",
      dataType: "json",
      data: formData3,
      cache: false, // Prevents cached responses
      success: function (response) {
          if (response.status.code === "200") {
              console.log("Location updated successfully!");

              // Close modal
              $("#editLocationModal").modal("hide");

              // Refresh locations AFTER the modal is completely hidden
              $("#editLocationModal").on('hidden.bs.modal', function () {
                  console.log("Refreshing locations...");
                  loadLocations(); // Reload table
              });

          } else {
              console.error("Error updating record: " + response.status.message);
          }
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.error("AJAX error: " + textStatus);
      }
  });
});


//DELETE PERSONNEL

$(document).on("click", ".deletePersonnelBtn", function () {
  let personnelId = $(this).attr("data-id");
  $("#deleteConfirmModal").modal("show");

  $("#confirmDeleteBtn").off("click").on("click", function () {
      $.ajax({
          url: "http://localhost/project2/dist/PHP/deletePersonnelByID.php",
          type: "POST",
          data: { id: personnelId },
          dataType: "json",
          success: function (response) {
              if (response.status.code === "200") {
                  console.log("Personnel deleted successfully!");
                  $(`button[data-id="${personnelId}"]`).closest("tr").remove();
                  $("#deleteConfirmModal").modal("hide");
              } else {
                  console.error("Error deleting personnel:", response.status.description);
              }
          },
          error: function (xhr, status, error) {
              console.error("AJAX Error:", status, error);
          }
      });
  });
});


//DELETE DEPARTMENT with dependancies check

$(document).on("click", ".deleteDepartmentBtn", function () {
  let departmentId = $(this).attr("data-id");

  console.log("Attempting to delete department ID:", departmentId); // Log department ID

  $.ajax({
      url: "http://localhost/project2/dist/PHP/deleteDepartmentByID.php",
      type: "POST",
      data: { id: departmentId },
      dataType: "json",
      success: function (response) {
          console.log("Delete response received:", response); // Log full response

          if (response.status.code === "409") {
              console.warn("Dependency exists. Showing warning modal."); // Log dependency error
              showDependencyWarning(response.status.description);
          } else if (response.status.code === "200") {
              console.log("Department deleted successfully!");
              $(`button[data-id="${departmentId}"]`).closest("tr").remove();
              $("#deleteConfirmModal").modal("hide");
          } else {
              console.error("Unexpected response:", response.status.description);
          }
      },
      error: function (xhr, status, error) {
          console.error("AJAX Error:", status, error);
      }
  });
});



//DELETE LOCATION  with dependancies check 

$(document).on("click", ".deleteLocationBtn", function () {
  let locationId = $(this).attr("data-id");

  // Step 1: Check for dependencies BEFORE showing confirmation modal
  $.ajax({
      url: "http://localhost/project2/dist/PHP/deleteLocationByID.php",
      type: "POST",
      data: { id: locationId },
      dataType: "json",
      success: function (response) {
          if (response.status.code === "409") {
              showDependencyWarning(response.status.description);
          } else if (response.status.code === "200") {
              $("#deleteConfirmModal").modal("show");

              // Step 2: Handle actual deletion only if confirmed
              $("#confirmDeleteBtn").off("click").on("click", function () {
                  $.ajax({
                      url: "http://localhost/project2/dist/PHP/deleteLocationByID.php",
                      type: "POST",
                      data: { id: locationId },
                      dataType: "json",
                      success: function (deleteResponse) {
                          if (deleteResponse.status.code === "200") {
                              $(`button[data-id="${locationId}"]`).closest("tr").remove();
                              $("#deleteConfirmModal").modal("hide");
                          }
                      }
                  });
              });
          }
      }
  });
});

// Dependency Warning Modal Function
function showDependencyWarning(message) {
  $("#dependencyWarningMessage").text(message);
  $("#dependencyWarningModal").modal("show");
}

