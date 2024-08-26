import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty',
  standalone: true,
  imports: [],
  templateUrl: './empty.component.html',
  styleUrl: './empty.component.scss',
})
export class EmptyComponent {
  @Input() message?: string = 'No hay elementos que mostrar';
  @Input() img?: string = 'default/empty.jpg';

  imgSrc: string = '../../../assets/' + this.img;
}
