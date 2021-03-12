window.onload = function() {

    //run the example at start
    $("#sucession").parent().addClass("has-success");
    let sucession = input_parser($("#sucession").val());
    algorithm(sucession);
    setTimeout(draw_graph,2000,sucession);


    let textbox = document.getElementById('sucession');
    textbox.onkeypress = function (e) {
        //remove the class for valid and wrong succession
        $("#sucession").parent().removeClass("has-error");
        $("#sucession").parent().removeClass("has-success");

        if (e.keyCode == 13) {
            let input = textbox.value;
            document.getElementById('table').innerHTML = "";
            document.getElementById('cy').innerHTML = "";

            if (valid_input(input)){
                $("#sucession").parent().addClass("has-success");
                let sucession = input_parser(input);
                algorithm(sucession);
                if (sequence_graphical(sucession)){
                    setTimeout(draw_graph,2000,sucession);
                };
            }

            else {
                $("#sucession").parent().addClass("has-error");
            };
        };
    };

    function valid_input(input) {
        let re = new RegExp("^( *([0-9])+ *,?)+$");
        return re.test(input);
    };

    function input_parser(input) {
        //returns integer array
        let array = input.split(",");
        let newArray = [];

        for (let i = 0; i < array.length; i++) {
            iel = array[i];
            iel = iel.replace(/ /g,"");
            newiel = parseInt(iel);
            if (!isNaN(newiel)){
                newArray.push(newiel);
            };
        };
        return newArray;
    };

    function stop_condition(array) {
        if (array[0] > array.length - 1){
            return true;
        }
        let sc = true;

        for (let i = 0; i < array.length; i++) {
            if (array[i] < 0) {
                return true;
            }
            else if(array[i] > 0){
                sc = false;
            }
        };
        return sc;
    }

    function is_graphical(last_array) {
        // body...
        for (let i = 0; i < last_array.length; i++) {
            if (last_array[i] < 0){
                return false;
            }
        };
        return true;
    }

    function sequence_graphical(sequence){
        if (sequence[0] > sequence.length -1){
            return false;
        }

        else if (!sequence.every(function(element){return element >= 0})){
            return false;
        }

        else if (sequence.every(function(element){return element == 0})){
            return true;
        }
        else {
            return sequence_graphical(alg_operation(sequence));
        }
    }

    function algorithm(array) {
        // body...

        array = array.sort(function(a, b){return b-a});
        append_row("table", array);

        while (!stop_condition(array)) {
            array = alg_operation(array);
            //console.log(array);
            append_row("table", array);
        };

        //console.log(is_graphical(array));
        let m = setTimeout(highlight_last_row, 1000);
    }

    function alg_operation(array) {
        //aplies the havel hakimi algorithm to array
        let i0 = array[0];
        let subs = array.slice(1,array.length);

        for (let x = 0; x < i0; x++) {
            subs[x] -= 1;
        };
        //Delete NaNs
        let seq = new Array();
        for (let i = 0; i < subs.length; i++) {
            if (!isNaN(subs[i])){
                seq.push(subs[i]);
            };
        };

        //descendent order
        seq = seq.sort(function(a, b){return b-a});

        return seq;
    };


/*------------------- DRAWING ----------------------*/
//

    function append_row(table_id, array) {
        // body...
        let data = array.slice();
        let table = document.getElementById(table_id);

        let nd = 0;
        let trows = table.rows;
        if (trows.length > 0) {
            let nd = trows[0].getElementsByTagName('td').length - data.length;
        }
        for (let i = 0; i != nd; i++) {
            data.unshift("");
        };
        //console.log(data);
        let row = document.createElement("TR");
        let th = document.createElement("TH");
        th.innerHTML = trows.length + ": ";
        row.appendChild(th);
        for (let i = 0; i < data.length; i++) {
            let td = document.createElement("TD");
            td.innerHTML = data[i];
            row.appendChild(td);
        };
        table.appendChild(row);
    }

    function highlight_last_row() {
        let table = document.getElementById("table");
        let trows = table.getElementsByTagName("TR");

        let tds = trows[trows.length-1].childNodes;

        //console.log(tds);
        let is_graph = true;

        for (let i = 0; i < tds.length; i++) {
            if (tds[i].innerHTML == "0"){
                tds[i].style.color = "#00ff00";
                tds[i].style.fontWeight = "bold";
            }
            else if(tds[i].innerHTML == "-1") {
                tds[i].style.color = "#d40000";
                tds[i].style.fontWeight = "bold";
                is_graph = false;
            }
        };
        if (parseInt(tds[1].innerHTML) > tds.length - 2){
            tds[1].style.color = "#d40000";
            tds[1].style.fontWeight = "bold";
            is_graph = false;
            //ugly but easier, do it correctly on refactoring
        }
        let to = setTimeout(table_result,1200,is_graph);
    }

    function table_result(is_graph) {
        if (is_graph){
            let tagresult = "<span id='result' class='glyphicon glyphicon-ok'>";
            let text = "graphic";
            let color = "#00ff00";
        }
        else {
            let tagresult = "<span id='result' class='glyphicon glyphicon-remove'>";
            let text = "not graphic";
            let color = "#d40000";
        }


        //$("#table > tr:last").append($("<td id='td-result' width='80px' colspan='6' rowspan='6'><img style='padding-left: 10px;' width='30px' height='15px' id='result' src='"+imgsrc+"'/></td>"));
        $("#table > tr:last").append($("<td id='td-result' width='80px' colspan='6' rowspan='6'>" + tagresult +"</span></td>"));

        let t = document.getElementById("table");

        let divresult = document.getElementById('result');

        let text_result = document.getElementById('text-result');
        text_result.innerHTML = text;
        text_result.style.color = color;

        divresult.onmouseover = show_text_result;
        divresult.onmouseout = hide_text_result;
    }

    function getPosition(element) {
        let xPosition = 0;
        let yPosition = 0;

        while(element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
        return { x: xPosition, y: yPosition };
    }

    function show_text_result() {
        document.getElementById('text-result').style.visibility = "visible";
    }

    function hide_text_result() {
        document.getElementById('text-result').style.visibility = "hidden";
    }

};
