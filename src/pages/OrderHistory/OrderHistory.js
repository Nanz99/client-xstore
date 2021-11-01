/** @format */

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { listOrderMine } from "../../actions/orderActions";
import Loading from "../../components/Loading/Loading";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { formatPrice } from "../../utils/helper";
import dateFormat from "dateformat";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
function OrderHistory(props) {
  const { loading, error, orders } = useSelector(
    (state) => state.orderMineList
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listOrderMine());
  }, [dispatch]);
  return (
    <div className="container py-16 px-20">
      <h1 className="text-3xl font-semibold mb-7">Order History</h1>
      {loading ? (
        <Loading />
      ) : error ? (
        toast.error(error)
      ) : (
        <TableContainer className="rounded-none" component={Paper}>
          <Table sx={{ with: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">STT</StyledTableCell>
                <StyledTableCell align="center">
                  Ngày Tạo Đơn Hàng
                </StyledTableCell>
                <StyledTableCell align="center">Tổng Đơn Hàng</StyledTableCell>
                <StyledTableCell align="center">Thanh Toán</StyledTableCell>
                <StyledTableCell align="center">Phương Thức</StyledTableCell>
                <StyledTableCell align="center">Tình Trạng</StyledTableCell>
                {/* <StyledTableCell align="center">Hành Động</StyledTableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders &&
                orders.map((item, index) => {
                  return (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="center" className="bg-white">
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="center" className="bg-white">
                        <div>
                          {dateFormat(item.createdAt, "HH:MM dd-mm-yyyy")}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell align="center" className="bg-white">
                        {formatPrice(item.checkoutDetails.totalOrder)}
                      </StyledTableCell>
                      <StyledTableCell align="center" className="bg-white">
                        {item.isPaid === true
                          ? "Đã Thanh Toán"
                          : "Chưa Thanh Toán"}
                      </StyledTableCell>
                      <StyledTableCell align="center" className="bg-white">
                        {item.isPaid === true ? item.checkoutDetails.paymentMethod : "Chưa Xác Định"}
                      </StyledTableCell>
                      <StyledTableCell align="center" className="bg-white">
                        {item.isPaid === true ? "Đang Giao" : "Đang xử Lý"}
                      </StyledTableCell>
                      {/* <StyledTableCell align="center" className="bg-white">
                        <button
                          type="button"
                          onClick={() => {
                            toast.success("Đã Xóa Đơn Hàng .");
                          }}
                        >
                          <i className="fa fa-trash-alt"></i>
                        </button>
                      </StyledTableCell> */}
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default OrderHistory;
