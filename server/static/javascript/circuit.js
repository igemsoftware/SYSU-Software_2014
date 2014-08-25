$(".element").draggable({
    revert: "invalid"
});

$("#canvas-circuit").droppable({
    accept: ".element-box > div"
});
