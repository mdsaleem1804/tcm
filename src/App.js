import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./pages/Dashboard";
import ListCustomer from "./pages/Customer/ListCustomer";
import AddCustomer from "./pages/Customer/AddCustomer";
import EditCustomer from "./pages/Customer/EditCustomer";
import ShowAppointment from "./pages/Appointments/ShowAppointment";
import DiagnosisEntry from "./pages/Diagnosis/DiagnosisEntry";
import PrescriptionEntry from "./pages/Prescription/PrescriptionEntry";
import MCEntry from "./pages/MedicalCertificate/MCEntry";
import Settings from "./Common/Settings";

import MCPreview from "./pages/MedicalCertificate/MCPreview";
import ReceiptPreview from "./pages/Receipt/ReceiptPreview";
import TreeViewSearch from "./pages/Prescription/TreeViewSearch";
import PrescriptionNew from "./pages/Prescription/PrescriptionNew";
import PaymentEntry from "./pages/Payment/PaymentEntry";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/ListCustomer" component={ListCustomer} />
          <Route path="/AddCustomer" component={AddCustomer} />
          <Route path="/EditCustomer" component={EditCustomer} />
          <Route path="/ShowAppointment" component={ShowAppointment} />
          <Route path="/MCEntry" component={MCEntry} />
          <Route path="/Settings" component={Settings} />
          <Route path="/MCPreview" component={MCPreview} />
          <Route path="/DiagnosisEntry" component={DiagnosisEntry} />
          <Route path="/PrescriptionEntry" component={PrescriptionEntry} />
          <Route path="/TreeViewSearch" component={TreeViewSearch} />
          <Route path="/PrescriptionNew" component={PrescriptionNew} />
          <Route path="/PaymentEntry" component={PaymentEntry} />
          <Route path="/ReceiptPreview" component={ReceiptPreview} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
