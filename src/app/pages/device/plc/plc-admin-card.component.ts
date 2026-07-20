import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlcAdminPage } from './plc-admin.page';

@Component({
  selector: 'app-plc-admin-card',
  standalone: true,
  imports: [CommonModule, PlcAdminPage],
  templateUrl: './plc-admin-card.component.html',
  styleUrls: ['./plc-admin-card.component.scss']
})
export class PlcAdminCardComponent {
  @Input() data: any;
}
