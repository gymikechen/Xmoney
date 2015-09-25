from django import forms

from .models import Sheet

class CreateExchangeForm(forms.Form):
    CHOICES = (('TWD', 'TWD'),
               ('USD', 'USD'),
               ('JPY', 'JPY'),
               ('RMB', 'RMB'),
               ('THB', 'THB'),
               )
    source_currency = forms.ChoiceField(choices=CHOICES)
    source_amount = forms.IntegerField(min_value=0, required=False)
    target_currency = forms.ChoiceField(choices=CHOICES)
    target_amount = forms.IntegerField(min_value=0, required=False)

    def save(self):
        sheet = Sheet.objects.create(source_currency=self.cleaned_data['source_currency'],
                                     target_currency=self.cleaned_data['target_currency'],
                                     source_amount=self.cleaned_data['source_amount'],
                                     target_amount=self.cleaned_data['target_amount'])
        sheet.save()
        return sheet

