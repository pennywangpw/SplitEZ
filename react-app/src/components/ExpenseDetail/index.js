
function ExpenseDetail({ exp }) {

    return (
        <>
            <div className="height-350px">
                <div>
                    <div id="description">{exp.name}</div>
                    <div id="description">{exp.expense_total}</div>
                </div>

                <div className="flx">
                    <div className="width-50 height-100">ppl involved</div>
                    <div className="width-50 height-100">comments</div>
                </div>
            </div>
        </>
    )
}

export default ExpenseDetail;
