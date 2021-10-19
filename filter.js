
function TableViewModel() {
    this.rows = ko.observableArray(data);
    var self = this;
    this.countries = ko.observableArray();
    this.cities = ko.observableArray();
    this.citiesByCountry = ko.observableArray();
    this.ageValue = ko.observable('-1');
    this.salaryValue = ko.observable('-1');
    this.pageNumber = ko.observable(0);
    this.rowsPerPage = ko.observable(10);
    this.totalPagesHolder = ko.observableArray();
    this.totalPages = ko.observable(0);
    this.showItems = function (item, event) {
        self.pageNumber(0);
        self.rowsPerPage(event.currentTarget.value);
        generatePagination();
    }
    this.filterByCountry = function (item, event) {
        let country = event.currentTarget.value
        if (event.currentTarget.checked) {
            let cities = document.getElementsByName(country);
            for (let j = 0; j < cities.length; j++) {
                let city = cities[j].value;
                if (!self.citiesByCountry().includes(city)) self.citiesByCountry().push(city);
            }
        } else {
            let cities = document.getElementsByName(country);
            for (let j = 0; j < cities.length; j++) {
                let city = cities[j].value;
                if (self.citiesByCountry().includes(city)) {
                    self.citiesByCountry.remove(city);
                }
                if (cities[j].checked) {
                    self.cities.remove(cities[j].value);
                }
                cities[j].checked = false;
            }
        }
        filterAll();
        return true;
    }
    this.filterByCity = function (item, event) {
        let itCountry = event.currentTarget.name;
        if (!self.countries().includes(itCountry)) {
            self.countries().push(itCountry);
        }
        if (event.target.checked) {
            document.getElementById(itCountry).checked = true;
            let citiesCB = document.getElementsByName(itCountry);
            let len = citiesCB.length;
            for (let i = 0; i < len; i++) {
                let city = citiesCB[i].value;
                if (citiesCB[i].checked) {
                    if (!self.citiesByCountry().includes(city)) {
                        self.citiesByCountry().push(city);
                    }
                } else {
                    if (self.citiesByCountry().includes(city)) {
                        self.citiesByCountry.remove(city);
                    }
                }
            }
        } else {
            self.citiesByCountry.remove(event.target.value);
            let citiesCB = document.getElementsByName(itCountry);
            let NoneOfTheCitiesSelected = true;
            for (let i = 0; i < citiesCB.length; i++) {
                if (citiesCB[i].checked) {
                    NoneOfTheCitiesSelected = false;
                    break;
                }
            }
            if (NoneOfTheCitiesSelected) {
                for (let i = 0; i < citiesCB.length; i++) {
                    let city = citiesCB[i].value;
                    if (!self.citiesByCountry().includes(city)) {
                        self.citiesByCountry().push(city);
                    }
                }
            }
        }
        filterAll();
        return true;
    }
    function filterByCities() {
        if (self.citiesByCountry().length > 0) {
            var arrays = [];
            for (let i in self.citiesByCountry()) {
                let city = self.citiesByCountry()[i];
                let filterArray = self.rows();
                filterArray = ko.utils.arrayFilter(filterArray, function (item) {
                    return item.City === city;
                });
                arrays.push(filterArray);
            }
            self.rows([].concat.apply([], arrays));
        } else {
            filterAll();
        }
    }
    this.ageFilter = function (item, event) {
        let age = Number(event.currentTarget.value);
        self.ageValue(age);
        filterAll();
    }
    function filterByAge(age) {
        if (age != -1) {
            let ageRange = 30;
            if (age == 31) ageRange = 40;
            else if (age == 41) ageRange = 50;
            let filterArray = self.rows();
            filterArray = ko.utils.arrayFilter(filterArray, function (item) {
                return item.Age >= age && item.Age <= ageRange;
            });
            self.rows(filterArray);
        } else {
            filterAll();
        }
    }
    function filterBySalary(salary) {
        if (salary != -1) {
            let salaryRange = 30000;
            if (salary == 30001) salaryRange = 40000;
            else if (salary == 40001) salaryRange = 50000;
            let filterArray = self.rows();
            filterArray = ko.utils.arrayFilter(filterArray, function (item) {
                return item.Salary >= salary && item.Salary <= salaryRange;
            });
            self.rows(filterArray);
        } else {
            filterAll();
        }
    }
    this.salaryFilter = function (item, event) {
        let salary = Number(event.currentTarget.value);
        self.salaryValue(salary);
        filterAll();
    }
    function filterByAgeAndSalary(age, salary) {
        let ageRange = 30;
        if (age == 31) ageRange = 40;
        else if (age == 41) ageRange = 50;
        let salaryRange = 30000;
        if (salary == 30001) salaryRange = 40000;
        else if (salary == 40001) salaryRange = 50000;
        let filterArray = self.rows();
        filterArray = ko.utils.arrayFilter(filterArray, function (item) {
            return item.Salary >= salary && item.Salary <= salaryRange && item.Age >= age && item.Age <= ageRange;
        });
        self.rows(filterArray);
    }
    function filterAll() {
        let state = self.citiesByCountry().length
        let age = self.ageValue();
        let salary = self.salaryValue();
        self.rows(data);
        if (state > 0 && age == -1 && salary == -1) {
            filterByCities();
        } else if (state > 0 && age != -1 && salary == -1) {
            filterByCities();
            filterByAge(Number(age));
        } else if (state > 0 && salary != -1 && age == -1) {
            filterByCities();
            filterBySalary(Number(salary));
        } else if (state > 0 && age != -1 && salary != -1) {
            filterByCities();
            filterByAgeAndSalary(Number(age), Number(salary));
        } else if (state == 0 && age != -1 && salary == -1) {
            filterByAge(Number(age));
        } else if (state == 0 && age == -1 && salary != -1) {
            filterBySalary(Number(salary));
        } else if (state == 0 && age != -1 && salary != -1) {
            filterByAgeAndSalary(Number(age), Number(salary));
        }
        generatePagination();

    }

    this.paginated = ko.computed(function () {
        var first = self.pageNumber() * Number(self.rowsPerPage());
        return self.rows.slice(first, first + Number(self.rowsPerPage()));
    });
    this.showPage = ko.computed(function () {
        return self.rows().length > self.paginated().length;
    })
    this.hasPrevious = ko.computed(function () {
        return self.pageNumber() !== 0;
    });
    this.hasNext = ko.computed(function () {
        return self.pageNumber() !== self.totalPages() - 1;
    });
    this.next = function () {
        if (self.pageNumber() < self.totalPages()) self.pageNumber(self.pageNumber() + 1);
    }
    this.previous = function () {
        if (self.pageNumber() != 0) self.pageNumber(self.pageNumber() - 1);
    }
    generatePagination();
    function generatePagination() {
        self.totalPagesHolder([]);
        self.totalPages = ko.computed(function () {
            var pages = Math.ceil(self.rows().length / self.rowsPerPage());
            for (let i = 0; i < pages; i++) {
                self.totalPagesHolder.push(i + 1);
            }
            return pages;
        });
    }
    this.clearAll = function () {
        this.rowsPerPage(10);
        this.searchValue('');
        this.countries([]);
        this.cities([]);
        this.rows(data);
        generatePagination();
    }
}
ko.applyBindings(new TableViewModel());
