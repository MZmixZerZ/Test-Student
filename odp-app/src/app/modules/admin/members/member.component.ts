import { ChangeDetectionStrategy, Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FuseDrawerComponent } from '@fuse/components/drawer';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone     : true,
  imports        : [RouterOutlet],
})
export class MemberComponent {
  @ViewChild('memberDrawer') memberDrawer: FuseDrawerComponent;

  constructor() {}

  openMemberDrawer(): void {
    // Reset state ที่เกี่ยวข้องกับการเพิ่มข้อมูล ถ้ามี
    // เช่น this.selectedMember = null;
    this.memberDrawer.open();
  }
}

