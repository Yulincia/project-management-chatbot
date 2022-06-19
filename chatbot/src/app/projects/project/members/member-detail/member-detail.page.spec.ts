import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MemberDetailPage } from './member-detail.page';

describe('MemberDetailPage', () => {
  let component: MemberDetailPage;
  let fixture: ComponentFixture<MemberDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MemberDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
