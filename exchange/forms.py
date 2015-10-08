from django import forms

from .models import Sheet

class CreateExchangeForm(forms.ModelForm):
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

    class Meta:
        model = Sheet
        fields = ('source_currency', 'source_amount', 'target_currency', 'target_amount',)
