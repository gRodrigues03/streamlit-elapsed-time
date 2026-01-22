import streamlit as st
a = st.components.v2.component('time_elapsed.time_elapsed',js='index.mjs',html='<div id=t-el>Salvo há 0 segundos</div>',css='#t-el{color:#fff;background-color:#2882c8e6;border-radius:.5rem;padding:.75rem}')
def last_updated(date):
    a(data={'date': date})