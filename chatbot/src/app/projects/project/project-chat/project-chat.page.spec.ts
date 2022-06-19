import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProjectChatPage } from './project-chat.page';

describe('ProjectChatPage', () => {
  let component: ProjectChatPage;
  let fixture: ComponentFixture<ProjectChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectChatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
