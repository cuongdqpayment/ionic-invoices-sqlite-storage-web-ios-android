import { Component } from '@angular/core';
import { CustomerPage } from '../customer/customer';
import { InvoicePage } from '../invoice/invoice';
import { ReportPage } from '../report/report';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CustomerPage;
  tab2Root = InvoicePage;
  tab3Root = ReportPage;

  constructor() {

  }
}
